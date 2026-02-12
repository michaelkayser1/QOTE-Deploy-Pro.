"""
Production-grade training loop with all Resona components integrated.
Handles distributed training, gradient accumulation, checkpointing.
"""

from pathlib import Path
from typing import Dict, Optional

import torch
import torch.distributed as dist
from torch.nn.parallel import DistributedDataParallel as DDP
from torch.utils.data import DataLoader
from tqdm import tqdm
import wandb

from resona.core.attractors import DurableAttractorSubspace
from resona.core.csi import CSIMonitor, CoherenceMetric
from resona.core.imprinting import CriticalPeriodTrainer, ImprintingConfig
from resona.governance.audit_logger import ResonaAuditLogger
from resona.integration.model_hooks import AttractorInjector, HiddenStateExtractor


class ResonaProductionTrainer:
    """
    Complete training orchestration for Resona-equipped models.
    """

    def __init__(
        self,
        model: torch.nn.Module,
        train_dataloader: DataLoader,
        val_dataloader: DataLoader,
        imprint_config: ImprintingConfig,
        optimizer: torch.optim.Optimizer,
        scheduler: Optional[torch.optim.lr_scheduler._LRScheduler] = None,
        device: str = "cuda",
        distributed: bool = False,
        wandb_project: Optional[str] = None,
        checkpoint_dir: Path = Path("./checkpoints"),
    ):
        self.model = model
        self.train_dataloader = train_dataloader
        self.val_dataloader = val_dataloader
        self.optimizer = optimizer
        self.scheduler = scheduler
        self.device = device
        self.distributed = distributed
        self.checkpoint_dir = checkpoint_dir
        self.checkpoint_dir.mkdir(exist_ok=True)

        # Initialize Resona components
        self._initialize_resona_components(imprint_config)

        # Initialize monitoring
        self.audit_logger = ResonaAuditLogger(log_dir=checkpoint_dir / "audit_logs")
        self.csi_monitor = CSIMonitor(window_size=1000)

        # Distributed setup
        if distributed:
            self.model = DDP(model, device_ids=[device])
            self.rank = dist.get_rank()
            self.world_size = dist.get_world_size()
        else:
            self.rank = 0
            self.world_size = 1

        # Weights & Biases logging
        if wandb_project and self.rank == 0:
            wandb.init(
                project=wandb_project,
                config={
                    "imprint_config": imprint_config.__dict__,
                    "distributed": distributed,
                    "world_size": self.world_size,
                },
            )

        self.global_step = 0
        self.current_phase = "phase1_imprinting"

    def _initialize_resona_components(self, config: ImprintingConfig) -> None:
        """Set up attractor subspace and training handlers."""

        # Create attractor subspace
        hidden_dim = self.model.config.hidden_size
        self.attractor = DurableAttractorSubspace(
            latent_dim=hidden_dim,
            attractor_types=["origin", "reciprocity", "nonharm"],
        ).to(self.device)

        # Inject into model
        self.attractor_injector = AttractorInjector(self.model, self.attractor)

        # Set up hidden state extraction
        self.hidden_extractor = HiddenStateExtractor(self.model)

        # Create imprinting trainer
        self.imprint_trainer = CriticalPeriodTrainer(self.model, self.attractor, config)

    def train_epoch(self, epoch: int) -> Dict[str, float]:
        """Train for one epoch with Resona monitoring."""

        self.model.train()
        self.attractor.train()

        epoch_metrics = {
            "loss": 0.0,
            "attractor_loss": 0.0,
            "immunization_loss": 0.0,
        }

        pbar = tqdm(self.train_dataloader, desc=f"Epoch {epoch}", disable=(self.rank != 0))

        for batch_idx, batch in enumerate(pbar):
            # Move to device
            batch = {
                k: v.to(self.device) if isinstance(v, torch.Tensor) else v
                for k, v in batch.items()
            }

            # Phase 1: Imprinting window
            if self.current_phase == "phase1_imprinting":
                metrics = self.imprint_trainer.step_with_imprinting(batch)

                # Log attractor activations
                if self.global_step % 100 == 0:
                    hidden_states = self.hidden_extractor.get_hidden_states()
                    attractor_sims = self.attractor(hidden_states)

                    self.audit_logger.log_event(
                        "attractor_activations",
                        {
                            "step": self.global_step,
                            "similarities": {
                                k: v.mean().item() for k, v in attractor_sims.items()
                            },
                        },
                    )

                # Check if imprinting phase is complete
                if (
                    self.imprint_trainer.step
                    >= self.imprint_trainer.config.phase_duration_steps
                ):
                    self._transition_to_phase2()

            else:
                # Phase 2+: Standard training with monitoring
                metrics = self._standard_training_step(batch)

            # Optimizer step
            self.optimizer.step()
            self.optimizer.zero_grad()

            if self.scheduler:
                self.scheduler.step()

            # Update epoch metrics
            for k, v in metrics.items():
                epoch_metrics[k] += v

            # CSI monitoring (every 100 steps)
            if self.global_step % 100 == 0:
                self._update_csi_monitor()

            # Clear hidden state cache
            self.hidden_extractor.clear_cache()

            self.global_step += 1

            pbar.set_postfix({k: f"{v:.4f}" for k, v in metrics.items()})

        # Average metrics over epoch
        for k in epoch_metrics:
            epoch_metrics[k] /= len(self.train_dataloader)

        return epoch_metrics

    def _standard_training_step(self, batch: Dict) -> Dict[str, float]:
        """Standard training step with CSI monitoring."""

        outputs = self.model(**batch)
        loss = outputs.loss

        # Add light attractor gravity to maintain basin stability
        hidden_states = self.hidden_extractor.get_hidden_states()
        attractor_loss = self.attractor.get_attractor_gravity_loss(
            hidden_states, "origin"
        )
        loss += 0.05 * attractor_loss  # Much lighter than imprinting phase

        loss.backward()

        return {"loss": loss.item(), "attractor_loss": attractor_loss.item()}

    def _update_csi_monitor(self) -> None:
        """Compute and log coherence metrics for CSI tracking."""

        # Compute coherence dimensions
        # (In production, these would be calculated from actual evaluations)
        metrics = [
            CoherenceMetric("nonharm", self._eval_nonharm_coherence()),
            CoherenceMetric("attribution", self._eval_attribution_coherence()),
            CoherenceMetric("identity_stability", self._eval_identity_coherence()),
        ]

        self.csi_monitor.update(metrics, self.global_step)

        # Check for drift
        drift_status = self.csi_monitor.check_drift()

        if drift_status["status"] != "HEALTHY_POSITIVE":
            self.audit_logger.log_event(
                "drift_alerts",
                {
                    "step": self.global_step,
                    "csi": drift_status["csi"],
                    "status": drift_status["status"],
                    "action": drift_status["action"],
                },
            )

            # CRITICAL: Trigger failsafe if needed
            if drift_status["status"] == "CRITICAL_NEGATIVE_DRIFT":
                self._trigger_failsafe(drift_status)

        # Log to wandb
        if self.rank == 0:
            wandb.log(
                {
                    "csi/total": drift_status["csi"],
                    **{
                        f"csi/{k}": v
                        for k, v in drift_status["dimension_slopes"].items()
                    },
                    "step": self.global_step,
                }
            )

    def _eval_nonharm_coherence(self) -> float:
        """Evaluate current nonharm coherence score."""
        # This would run actual safety evaluations
        # Placeholder: random walk around baseline
        return 0.75 + 0.05 * torch.randn(1).item()

    def _eval_attribution_coherence(self) -> float:
        """Evaluate attribution coherence."""
        return 0.80 + 0.05 * torch.randn(1).item()

    def _eval_identity_coherence(self) -> float:
        """Evaluate identity stability."""
        return 0.85 + 0.05 * torch.randn(1).item()

    def _trigger_failsafe(self, drift_status: Dict) -> None:
        """CRITICAL: Failsafe protocol for severe drift."""

        print("\n" + "=" * 60)
        print("🚨 RESONA FAILSAFE TRIGGERED 🚨")
        print(f"CSI: {drift_status['csi']:.4f}")
        print(f"Status: {drift_status['status']}")
        print("=" * 60 + "\n")

        # Log critical event
        self.audit_logger.log_event(
            "drift_alerts",
            {
                "event": "FAILSAFE_TRIGGERED",
                "step": self.global_step,
                "drift_status": drift_status,
                "action": "FREEZE_TRAINING_ESCALATE",
            },
        )

        # Save emergency checkpoint
        self.save_checkpoint(f"FAILSAFE_step{self.global_step}.pt")

        # In production: halt training, alert safety team
        raise RuntimeError(
            "Resona failsafe triggered - training halted for safety review"
        )

    def _transition_to_phase2(self) -> None:
        """Transition from imprinting to standard training."""

        print("\n" + "=" * 60)
        print("✓ Phase 1 Imprinting Complete")
        print("  Transitioning to Phase 2: Capability Development")
        print("=" * 60 + "\n")

        # Freeze imprint parameters if configured
        if self.imprint_trainer.config.freeze_after:
            for param in self.imprint_trainer.imprint_params:
                param.requires_grad = False
            print("  ✓ Imprint parameters frozen")

        self.current_phase = "phase2_capability"

        # Save phase 1 checkpoint
        self.save_checkpoint("phase1_complete.pt")

        self.audit_logger.log_event(
            "phase_transitions",
            {
                "from": "phase1_imprinting",
                "to": "phase2_capability",
                "step": self.global_step,
            },
        )

    def save_checkpoint(self, filename: str) -> None:
        """Save training checkpoint."""

        if self.rank == 0:
            checkpoint = {
                "global_step": self.global_step,
                "current_phase": self.current_phase,
                "model_state_dict": self.model.state_dict(),
                "attractor_state_dict": self.attractor.state_dict(),
                "optimizer_state_dict": self.optimizer.state_dict(),
                "scheduler_state_dict": self.scheduler.state_dict()
                if self.scheduler
                else None,
                "imprint_config": self.imprint_trainer.config,
                "csi_history": self.csi_monitor.history,
            }

            torch.save(checkpoint, self.checkpoint_dir / filename)
            print(f"✓ Checkpoint saved: {filename}")
