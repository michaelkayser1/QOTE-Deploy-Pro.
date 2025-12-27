#!/usr/bin/env python3
"""
Unit tests for TORD models
===========================

Tests for both Python reference and JAX production implementations.

Author: Michael Kayser
Date: 2025-12-27
"""

import sys
sys.path.append('..')

import numpy as np
import pytest

from models.tord_core import (
    TORDModel,
    TORDParameters,
    get_uv_triage_params,
    get_engram_params,
    get_hpa_stress_params,
    get_development_params
)


class TestTORDParameters:
    """Test parameter classes."""

    def test_default_parameters(self):
        """Test default parameter initialization."""
        params = TORDParameters()

        # Check required attributes exist
        assert hasattr(params, 'omega_x')
        assert hasattr(params, 'omega_y')
        assert hasattr(params, 'gamma_x')
        assert hasattr(params, 'gamma_y')
        assert hasattr(params, 'alpha')
        assert hasattr(params, 'beta')
        assert hasattr(params, 'kappa')
        assert hasattr(params, 'lambda_')
        assert hasattr(params, 'eta')
        assert hasattr(params, 'mu')

        # Check reasonable value ranges
        assert params.omega_x > 0
        assert params.omega_y > 0
        assert params.gamma_x >= 0
        assert params.gamma_y >= 0
        assert params.eta > 0

    def test_scenario_parameters(self):
        """Test scenario-specific parameters."""
        # UV triage: fast repair delay
        uv_params = get_uv_triage_params()
        assert uv_params.eta < 0.5  # Less than 30min

        # Engram: strong reinforcement, low decay
        engram_params = get_engram_params()
        assert engram_params.kappa > 0.1  # Strong reinforcement
        assert engram_params.lambda_ < 0.02  # Low decay

        # HPA: moderate boundary erosion
        hpa_params = get_hpa_stress_params()
        assert hpa_params.mu > 0.3  # Strong stress coupling
        assert hpa_params.lambda_ > 0.03  # Moderate erosion

        # Development: very stable boundaries
        dev_params = get_development_params()
        assert dev_params.kappa > 0.15  # Very strong formation
        assert dev_params.lambda_ < 0.01  # Extremely stable


class TestTORDModel:
    """Test TORD model simulation."""

    def test_initialization(self):
        """Test model initialization."""
        params = TORDParameters()
        model = TORDModel(params)

        assert model.p == params
        assert isinstance(model.history_x, list)
        assert isinstance(model.history_y, list)
        assert isinstance(model.history_t, list)

    def test_perturbation_patterns(self):
        """Test perturbation functions."""
        params = TORDParameters()
        model = TORDModel(params)

        # Pulse: should be 1.0 during pulse window, 0.0 elsewhere
        assert model.perturbation(3.0, "pulse") == 0.0
        assert model.perturbation(5.2, "pulse") == 1.0
        assert model.perturbation(6.0, "pulse") == 0.0

        # Stress: periodic, non-negative
        stress_vals = [model.perturbation(t, "stress") for t in np.linspace(0, 50, 100)]
        assert all(v >= 0 for v in stress_vals)

        # Chronic: sustained, non-negative
        chronic_vals = [model.perturbation(t, "chronic") for t in np.linspace(0, 50, 100)]
        assert all(v >= 0 for v in chronic_vals)
        assert np.std(chronic_vals) < 0.1  # Should be relatively constant

    def test_simulation_basic(self):
        """Test basic simulation run."""
        params = TORDParameters()
        model = TORDModel(params)

        # Short simulation
        t, states = model.simulate(
            t_span=(0, 10),
            n_points=100,
            u_pattern="pulse"
        )

        # Check output shapes
        assert len(t) == 100
        assert states.shape == (100, 5)  # [x, v_x, y, v_y, theta]

        # Check state variables are finite
        assert np.all(np.isfinite(states))

        # Check boundary strength is non-negative
        theta = states[:, 4]
        assert np.all(theta >= 0)

    def test_simulation_scenarios(self):
        """Test simulations for all scenarios complete without errors."""
        scenarios = [
            (get_uv_triage_params(), "pulse", (0, 20)),
            (get_engram_params(), "recall", (0, 50)),
            (get_hpa_stress_params(), "stress", (0, 30)),
            (get_development_params(), "chronic", (0, 20)),
        ]

        for params, pattern, t_span in scenarios:
            model = TORDModel(params)
            t, states = model.simulate(
                t_span=t_span,
                n_points=500,
                u_pattern=pattern
            )

            # Check completion
            assert len(t) == 500
            assert states.shape == (500, 5)
            assert np.all(np.isfinite(states))

    def test_state_conservation(self):
        """Test that state variables remain in reasonable bounds."""
        params = TORDParameters()
        model = TORDModel(params)

        t, states = model.simulate(
            t_span=(0, 50),
            n_points=1000,
            u_pattern="pulse"
        )

        x = states[:, 0]
        y = states[:, 2]
        theta = states[:, 4]

        # Check no runaway growth (oscillators should be bounded)
        assert np.abs(x).max() < 100  # Reasonable bound
        assert np.abs(y).max() < 100
        assert theta.max() < 100

        # Check boundary strength stays non-negative
        assert theta.min() >= 0

    def test_delay_effect(self):
        """Test that delay parameter affects dynamics."""
        # Two models: one with short delay, one with long delay
        params_short = TORDParameters(eta=0.1)
        params_long = TORDParameters(eta=2.0)

        model_short = TORDModel(params_short)
        model_long = TORDModel(params_long)

        t_span = (0, 20)
        n_points = 500

        t, states_short = model_short.simulate(t_span=t_span, n_points=n_points, u_pattern="pulse")
        t, states_long = model_long.simulate(t_span=t_span, n_points=n_points, u_pattern="pulse")

        # Trajectories should differ due to delay
        x_short = states_short[:, 0]
        x_long = states_long[:, 0]

        # Check that trajectories are not identical
        assert not np.allclose(x_short, x_long, rtol=0.1)


class TestTORDJAX:
    """Test JAX implementation."""

    def test_jax_import(self):
        """Test that JAX model can be imported."""
        try:
            from models.tord_jax import TORDModelJAX, TORDParamsJAX
            # If import succeeds, test passed
            assert True
        except ImportError:
            pytest.skip("JAX not installed")

    def test_jax_simulation(self):
        """Test JAX simulation runs."""
        try:
            from models.tord_jax import TORDModelJAX, TORDParamsJAX
            import jax.numpy as jnp
        except ImportError:
            pytest.skip("JAX not installed")

        params = TORDParamsJAX()
        model = TORDModelJAX(params)

        initial_state = jnp.array([0.1, 0.0, 0.05, 0.0, 1.0])

        t, states = model.simulate(
            t_span=(0.0, 20.0),
            n_points=500,
            initial_state=initial_state,
            u_pattern="pulse"
        )

        # Check output
        assert len(t) == 500
        assert states.shape == (500, 5)
        assert jnp.all(jnp.isfinite(states))

    def test_jax_parameter_sweep(self):
        """Test JAX parameter sweep functionality."""
        try:
            from models.tord_jax import TORDModelJAX, TORDParamsJAX
            import jax.numpy as jnp
        except ImportError:
            pytest.skip("JAX not installed")

        params = TORDParamsJAX()
        model = TORDModelJAX(params)

        alpha_range = jnp.linspace(0.1, 0.5, 5)
        results = model.parameter_sweep(
            param_name='alpha',
            param_range=alpha_range,
            t_span=(0.0, 10.0),
            n_points=200,
            u_pattern="pulse"
        )

        # Check output structure
        assert 'param_values' in results
        assert 't' in results
        assert 'states_ensemble' in results

        # Check ensemble shape: (n_params, n_points, n_states)
        assert results['states_ensemble'].shape == (5, 200, 5)


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
