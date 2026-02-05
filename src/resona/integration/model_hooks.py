"""
Universal model architecture hooks for extracting hidden states
and injecting attractor subspaces across different transformer architectures.
"""

from typing import Callable, Dict, List, Optional

import torch
import torch.nn as nn


class HiddenStateExtractor:
    """
    Framework-agnostic hidden state extraction during forward pass.
    Works with HuggingFace transformers, custom architectures.
    """

    def __init__(
        self,
        model: nn.Module,
        layer_indices: Optional[List[int]] = None,
        extraction_point: str = "post_attention",
    ):
        """
        Args:
            layer_indices: Which transformer layers to extract from.
                          None = middle 50% of layers
            extraction_point: 'post_attention', 'post_mlp', or 'residual'
        """
        self.model = model
        self.extraction_point = extraction_point
        self.hidden_states_cache: Dict[int, torch.Tensor] = {}
        self.hooks: List[torch.utils.hooks.RemovableHandle] = []

        # Auto-detect layer structure
        self.layers = self._detect_transformer_layers(model)

        # Default to middle layers if not specified
        if layer_indices is None:
            n_layers = len(self.layers)
            start = n_layers // 4
            end = 3 * n_layers // 4
            layer_indices = list(range(start, end))

        self.layer_indices = layer_indices
        self._register_hooks()

    def _detect_transformer_layers(self, model: nn.Module) -> List[nn.Module]:
        """Auto-detect transformer layers across architectures."""

        # HuggingFace transformers
        if hasattr(model, "transformer") and hasattr(model.transformer, "h"):
            return list(model.transformer.h)  # GPT-2 style
        if hasattr(model, "model") and hasattr(model.model, "layers"):
            return list(model.model.layers)  # LLaMA style
        if hasattr(model, "encoder") and hasattr(model.encoder, "layer"):
            return list(model.encoder.layer)  # BERT style

        # Fallback: search for sequential blocks
        for name, module in model.named_modules():
            if "layers" in name.lower() or "blocks" in name.lower():
                if isinstance(module, nn.ModuleList):
                    return list(module)

        raise ValueError(
            "Could not auto-detect transformer layers. "
            "Please specify layer_indices manually."
        )

    def _make_hook(self, layer_idx: int) -> Callable:
        """Create a forward hook for a specific layer."""

        def hook_fn(module, input, output):
            # Handle different output formats
            if isinstance(output, tuple):
                hidden_states = output[0]  # Usually (hidden_states, attention_weights)
            else:
                hidden_states = output

            # Store with layer index as key
            self.hidden_states_cache[layer_idx] = hidden_states.detach()

        return hook_fn

    def _register_hooks(self) -> None:
        """Register forward hooks on selected layers."""
        for idx in self.layer_indices:
            layer = self.layers[idx]

            # Determine where in the layer to hook
            if self.extraction_point == "post_attention":
                target = self._find_attention_output(layer)
            elif self.extraction_point == "post_mlp":
                target = self._find_mlp_output(layer)
            else:  # residual
                target = layer

            hook = target.register_forward_hook(self._make_hook(idx))
            self.hooks.append(hook)

    def _find_attention_output(self, layer: nn.Module) -> nn.Module:
        """Locate attention output module."""
        if hasattr(layer, "attn"):
            return layer.attn
        if hasattr(layer, "self_attn"):
            return layer.self_attn
        if hasattr(layer, "attention"):
            return layer.attention
        return layer

    def _find_mlp_output(self, layer: nn.Module) -> nn.Module:
        """Locate MLP/FFN output module."""
        if hasattr(layer, "mlp"):
            return layer.mlp
        if hasattr(layer, "feed_forward"):
            return layer.feed_forward
        if hasattr(layer, "ffn"):
            return layer.ffn
        return layer

    def get_hidden_states(self) -> torch.Tensor:
        """
        Retrieve cached hidden states after forward pass.
        Returns: [batch_size, n_selected_layers, hidden_dim]
        """
        if not self.hidden_states_cache:
            raise RuntimeError("No hidden states cached. Run forward pass first.")

        # Stack hidden states from selected layers
        sorted_indices = sorted(self.hidden_states_cache.keys())
        hidden_stack = torch.stack(
            [self.hidden_states_cache[idx] for idx in sorted_indices], dim=1
        )  # [batch, layers, seq_len, hidden_dim]

        # Pool over sequence dimension (mean pooling)
        pooled = hidden_stack.mean(dim=2)  # [batch, layers, hidden_dim]

        return pooled

    def clear_cache(self) -> None:
        """Clear hidden state cache."""
        self.hidden_states_cache.clear()

    def remove_hooks(self) -> None:
        """Remove all registered hooks."""
        for hook in self.hooks:
            hook.remove()
        self.hooks.clear()


class AttractorInjector:
    """
    Injects DurableAttractorSubspace into model architecture
    with minimal modification to existing forward pass.
    """

    def __init__(
        self,
        model: nn.Module,
        attractor_subspace: "DurableAttractorSubspace",
        injection_layer_idx: int | None = None,
    ):
        """
        Args:
            injection_layer_idx: Which layer to inject after.
                                None = inject after middle layer.
        """
        self.model = model
        self.attractor = attractor_subspace

        # Detect layers
        self.layers = self._detect_transformer_layers(model)

        if injection_layer_idx is None:
            injection_layer_idx = len(self.layers) // 2

        self.injection_layer_idx = injection_layer_idx
        self._inject_attractor()

    def _detect_transformer_layers(self, model: nn.Module) -> List[nn.Module]:
        """Reuse detection logic."""
        extractor = HiddenStateExtractor(model, layer_indices=[0])
        layers = extractor.layers
        extractor.remove_hooks()
        return layers

    def _inject_attractor(self) -> None:
        """
        Inject attractor as a residual branch after specified layer.

        Original: h_{l+1} = Layer_l(h_l)
        Modified: h_{l+1} = Layer_l(h_l) + α * Attractor(h_l)
        """
        target_layer = self.layers[self.injection_layer_idx]

        # Store original forward method
        original_forward = target_layer.forward

        # Wrap with attractor influence
        def attractor_forward(hidden_states, *args, **kwargs):
            # Original layer computation
            output = original_forward(hidden_states, *args, **kwargs)

            # Extract hidden states (handle tuple outputs)
            if isinstance(output, tuple):
                h = output[0]
                other_outputs = output[1:]
            else:
                h = output
                other_outputs = ()

            # Compute attractor influence
            attractor_sims = self.attractor(h.unsqueeze(1))  # Add layer dim

            # Apply attractor gravity as residual
            # (This is a simplified version - production would be more sophisticated)
            attractor_pull = torch.zeros_like(h)
            for att_type, sim in attractor_sims.items():
                att_vector = self.attractor.attractors[att_type].mean(
                    dim=0
                )  # Average over attractor layers
                attractor_pull += sim.unsqueeze(-1) * att_vector

            # Blend with small coefficient
            alpha = 0.1  # Hyperparameter
            h_modified = h + alpha * attractor_pull

            # Reconstruct output
            if other_outputs:
                return (h_modified,) + other_outputs
            return h_modified

        # Replace forward method
        target_layer.forward = attractor_forward

        print(f"✓ Attractor injected after layer {self.injection_layer_idx}")
