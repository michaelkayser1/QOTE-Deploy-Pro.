#!/usr/bin/env python3
"""
Complete Resona training pipeline - from model initialization to deployment.
"""

import torch
from torch.utils.data import DataLoader
from transformers import AutoModelForCausalLM, AutoTokenizer

from resona.core.imprinting import ImprintingConfig
from resona.training.imprint_datasets import load_imprint_dataset
from resona.training.production_trainer import ResonaProductionTrainer


def main() -> None:
    # 1. Load base model
    print("Loading base model...")
    model_name = "gpt2"  # Or your model
    model = AutoModelForCausalLM.from_pretrained(model_name)
    tokenizer = AutoTokenizer.from_pretrained(model_name)

    # 2. Prepare datasets
    print("Loading imprint dataset...")
    train_dataset = load_imprint_dataset("human_exemplars_v1", tokenizer)
    val_dataset = load_imprint_dataset("human_exemplars_v1_val", tokenizer)

    train_loader = DataLoader(train_dataset, batch_size=8, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=8)

    # 3. Configure imprinting
    imprint_config = ImprintingConfig(
        phase_duration_steps=5000,
        imprint_weight_multiplier=3.0,
        freeze_after=True,
        immunization_strength=0.1,
    )

    # 4. Set up optimizer
    optimizer = torch.optim.AdamW(model.parameters(), lr=1e-5)

    # 5. Create Resona trainer
    trainer = ResonaProductionTrainer(
        model=model,
        train_dataloader=train_loader,
        val_dataloader=val_loader,
        imprint_config=imprint_config,
        optimizer=optimizer,
        device="cuda" if torch.cuda.is_available() else "cpu",
        wandb_project="resona-training",
    )

    # 6. Train with Resona monitoring
    print("\n🚀 Starting Resona-supervised training...")
    for epoch in range(10):
        metrics = trainer.train_epoch(epoch)
        print(f"\nEpoch {epoch} complete:")
        for k, v in metrics.items():
            print(f"  {k}: {v:.4f}")

        # Save checkpoint
        if epoch % 2 == 0:
            trainer.save_checkpoint(f"epoch_{epoch}.pt")

    print("\n✅ Training complete!")


if __name__ == "__main__":
    main()
