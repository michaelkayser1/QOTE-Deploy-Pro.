#!/usr/bin/env python3
"""
TORD: Topological Oscillator with Repair Delay
===============================================

Core formal model for biological governance through chromatin topology.

State variables map directly to biological observables:
- x(t): Chromatin accessibility (ATAC-seq, DNase-seq)
- y(t): Repair system activity (γH2AX, 53BP1 foci)
- Θ(t): Topological boundary strength (Hi-C insulation score)
- u(t): Environmental perturbation (UV dose, hormone pulse, stress)
- η: Repair delay (minutes to hours, context-dependent)

Literature grounding:
- RT/CA mutation hotspots (Stamatoyannopoulos et al. Nature 2009)
- UV triage at accessible sites (Adar et al. Genome Res 2016)
- Persistent loops in engrams (Chen et al. Nature Neurosci 2024)
- ART in cancer (Ryba et al. Genome Res 2011)
- PMD depth in aging (Zhou et al. Nat Genet 2018)

Author: Michael Kayser
Date: 2025-12-27
"""

import numpy as np
from scipy.integrate import odeint
from dataclasses import dataclass
from typing import Tuple, Callable, Optional
import csv


@dataclass
class TORDParameters:
    """
    TORD model parameters with literature-grounded defaults.

    Biological interpretation:
    - omega_x: Accessibility oscillation frequency (circadian ~ 2π/24hr or faster)
    - omega_y: Repair response frequency (typically faster than damage accumulation)
    - gamma_x: Accessibility damping (chromatin remodeling timescale)
    - gamma_y: Repair system saturation/fatigue rate
    - alpha: Repair-to-accessibility coupling (negative feedback)
    - beta: Accessibility-to-repair coupling (damage sensing)
    - kappa: Boundary strength reinforcement rate
    - lambda_: Boundary decay rate (aging, repeated stress)
    - eta: Repair delay (context-dependent: 20min for NER, hours for DSB)
    """

    # Core oscillator frequencies
    omega_x: float = 2 * np.pi / 24.0  # Daily rhythm (1/hr)
    omega_y: float = 2 * np.pi / 4.0   # Repair cycle ~4hr

    # Damping coefficients
    gamma_x: float = 0.1  # Accessibility relaxation
    gamma_y: float = 0.15 # Repair saturation

    # Coupling strengths
    alpha: float = 0.3    # Repair → accessibility (negative feedback)
    beta: float = 0.4     # Accessibility → repair (damage sensing)

    # Boundary dynamics
    kappa: float = 0.05   # Reinforcement rate
    lambda_: float = 0.02 # Decay rate (aging)

    # Repair delay (hours)
    eta: float = 0.5      # Default: 30min (NER at accessible sites)

    # Perturbation coupling
    mu: float = 0.2       # External perturbation strength


class TORDModel:
    """
    TORD differential equations with delay.

    System:
        dx/dt = -ω_x² x - γ_x dx/dt - α y(t-η) + μ u(t)
        dy/dt = -ω_y² y - γ_y dy/dt + β x(t)
        dΘ/dt = κ |x|² - λ Θ

    Where:
        - y(t-η) implements repair delay
        - Θ represents boundary strength (always positive)
        - u(t) is external perturbation
    """

    def __init__(self, params: TORDParameters):
        self.p = params

        # History buffer for delay
        self.history_x = []
        self.history_y = []
        self.history_t = []

    def perturbation(self, t: float, pattern: str = "pulse") -> float:
        """
        External perturbation u(t).

        Patterns:
        - "pulse": Single UV dose
        - "stress": Repeated stress pulses
        - "chronic": Sustained inflammation
        - "recall": Memory recall protocol
        """
        if pattern == "pulse":
            # Single damage pulse (UV dose)
            return 1.0 if 5.0 <= t <= 5.5 else 0.0

        elif pattern == "stress":
            # Repeated stress (HPA axis)
            period = 12.0  # Twice daily
            return 0.8 * np.sin(2 * np.pi * t / period) if np.sin(2 * np.pi * t / period) > 0 else 0.0

        elif pattern == "chronic":
            # Sustained inflammation
            return 0.3 * (1.0 + 0.1 * np.sin(2 * np.pi * t / 24.0))

        elif pattern == "recall":
            # Memory recall pulses
            recall_times = [10.0, 20.0, 30.0]
            return 1.2 if any(abs(t - tr) < 0.2 for tr in recall_times) else 0.0

        else:
            return 0.0

    def derivatives(self, state: np.ndarray, t: float,
                   u_pattern: str = "pulse") -> np.ndarray:
        """
        Compute state derivatives for TORD system.

        Args:
            state: [x, v_x, y, v_y, Θ] where v_x = dx/dt, v_y = dy/dt
            t: Current time
            u_pattern: Perturbation pattern

        Returns:
            derivatives: [dx/dt, dv_x/dt, dy/dt, dv_y/dt, dΘ/dt]
        """
        x, v_x, y, v_y, theta = state

        # Store current state in history
        self.history_t.append(t)
        self.history_x.append(x)
        self.history_y.append(y)

        # Get delayed values y(t-η)
        y_delayed = self._get_delayed(t - self.p.eta, self.history_t,
                                      self.history_y, default=y)

        # External perturbation
        u_t = self.perturbation(t, u_pattern)

        # Second-order oscillator equations
        # d²x/dt² = -ω_x² x - γ_x dx/dt - α y(t-η) + μ u(t)
        dv_x_dt = (
            -self.p.omega_x**2 * x
            - self.p.gamma_x * v_x
            - self.p.alpha * y_delayed
            + self.p.mu * u_t
        )

        # d²y/dt² = -ω_y² y - γ_y dy/dt + β x(t)
        dv_y_dt = (
            -self.p.omega_y**2 * y
            - self.p.gamma_y * v_y
            + self.p.beta * x
        )

        # Boundary strength: dΘ/dt = κ |x|² - λ Θ
        # Interpretation: Accessibility fluctuations reinforce boundaries
        dtheta_dt = self.p.kappa * x**2 - self.p.lambda_ * theta

        return np.array([v_x, dv_x_dt, v_y, dv_y_dt, dtheta_dt])

    @staticmethod
    def _get_delayed(t_delay: float, t_hist: list, y_hist: list,
                     default: float = 0.0) -> float:
        """
        Interpolate delayed value from history.

        Uses linear interpolation. If t_delay is before history starts,
        returns default value (initial condition).
        """
        if not t_hist or t_delay < t_hist[0]:
            return default

        # Find bracketing indices
        for i in range(len(t_hist) - 1):
            if t_hist[i] <= t_delay <= t_hist[i + 1]:
                # Linear interpolation
                alpha = (t_delay - t_hist[i]) / (t_hist[i + 1] - t_hist[i])
                return (1 - alpha) * y_hist[i] + alpha * y_hist[i + 1]

        # If beyond history, return most recent value
        return y_hist[-1] if y_hist else default

    def simulate(self,
                 t_span: Tuple[float, float] = (0.0, 100.0),
                 n_points: int = 5000,
                 initial_state: Optional[np.ndarray] = None,
                 u_pattern: str = "pulse") -> Tuple[np.ndarray, np.ndarray]:
        """
        Simulate TORD system over time span.

        Args:
            t_span: (t_start, t_end) in hours
            n_points: Number of time points
            initial_state: Initial [x, v_x, y, v_y, Θ] (default: near equilibrium)
            u_pattern: Perturbation pattern

        Returns:
            t: Time array
            states: State trajectories [x, v_x, y, v_y, Θ]
        """
        # Reset history
        self.history_t = []
        self.history_x = []
        self.history_y = []

        # Default initial conditions (near equilibrium with small perturbation)
        if initial_state is None:
            initial_state = np.array([0.1, 0.0, 0.05, 0.0, 1.0])

        # Time array
        t = np.linspace(t_span[0], t_span[1], n_points)

        # Integrate
        states = odeint(self.derivatives, initial_state, t, args=(u_pattern,))

        return t, states

    def save_trajectory(self, filename: str, t: np.ndarray, states: np.ndarray):
        """
        Save trajectory to CSV file.

        Format:
            time, x, v_x, y, v_y, theta
        """
        with open(filename, 'w', newline='') as f:
            writer = csv.writer(f)
            writer.writerow(['time', 'x_accessibility', 'v_x',
                           'y_repair', 'v_y', 'theta_boundary'])
            for i in range(len(t)):
                writer.writerow([t[i]] + states[i].tolist())
        print(f"Trajectory saved to {filename}")


# ============================================================================
# Biological scenario presets
# ============================================================================

def get_uv_triage_params() -> TORDParameters:
    """
    Parameters for UV damage triage scenario.

    Biology: NER prioritizes accessible chromatin over damage sites
    (Adar et al. Genome Res 2016)

    Key features:
    - Fast repair at accessible sites (η ~ 20min)
    - Strong accessibility-repair coupling (high β)
    """
    params = TORDParameters()
    params.eta = 0.33  # 20 minutes
    params.beta = 0.6  # Strong damage sensing
    params.alpha = 0.4 # Strong feedback
    return params


def get_engram_params() -> TORDParameters:
    """
    Parameters for engram memory persistence scenario.

    Biology: Persistent chromatin loops in engram neurons
    (Chen et al. Nature Neurosci 2024)

    Key features:
    - Strong boundary reinforcement (high κ)
    - Low boundary decay (low λ)
    - Long-lasting accessibility changes
    """
    params = TORDParameters()
    params.kappa = 0.15   # Strong reinforcement
    params.lambda_ = 0.01 # Slow decay (weeks-long persistence)
    params.omega_x = 2 * np.pi / 48.0  # Slower dynamics
    return params


def get_hpa_stress_params() -> TORDParameters:
    """
    Parameters for HPA axis stress response.

    Biology: Glucocorticoid receptor dynamics, FKBP5 feedback

    Key features:
    - Repeated perturbations (stress pulses)
    - Moderate boundary decay (stress-induced remodeling)
    - Inflammation coupling
    """
    params = TORDParameters()
    params.mu = 0.35      # Strong stress coupling
    params.lambda_ = 0.04 # Moderate boundary erosion
    params.gamma_y = 0.2  # Repair fatigue under chronic stress
    return params


def get_development_params() -> TORDParameters:
    """
    Parameters for developmental boundary formation.

    Biology: Mechanotransduction, TAD boundary establishment

    Key features:
    - Strong boundary formation (high κ)
    - Persistent boundaries (very low λ)
    """
    params = TORDParameters()
    params.kappa = 0.20   # Very strong reinforcement
    params.lambda_ = 0.005 # Extremely stable boundaries
    params.omega_x = 2 * np.pi / 12.0  # Faster developmental dynamics
    return params


# ============================================================================
# Example usage and validation
# ============================================================================

if __name__ == "__main__":
    print("TORD Core Model - Example Simulations")
    print("=" * 60)

    # Test 1: UV triage scenario
    print("\n1. UV Triage Scenario")
    print("-" * 60)
    params_uv = get_uv_triage_params()
    model_uv = TORDModel(params_uv)
    t_uv, states_uv = model_uv.simulate(
        t_span=(0, 50),
        n_points=2000,
        u_pattern="pulse"
    )
    model_uv.save_trajectory("tord_uv_triage.csv", t_uv, states_uv)

    # Test 2: Engram persistence
    print("\n2. Engram Memory Persistence")
    print("-" * 60)
    params_engram = get_engram_params()
    model_engram = TORDModel(params_engram)
    t_engram, states_engram = model_engram.simulate(
        t_span=(0, 200),
        n_points=3000,
        u_pattern="recall"
    )
    model_engram.save_trajectory("tord_engram.csv", t_engram, states_engram)

    # Test 3: HPA stress
    print("\n3. HPA Stress Response")
    print("-" * 60)
    params_hpa = get_hpa_stress_params()
    model_hpa = TORDModel(params_hpa)
    t_hpa, states_hpa = model_hpa.simulate(
        t_span=(0, 120),
        n_points=3000,
        u_pattern="stress"
    )
    model_hpa.save_trajectory("tord_hpa.csv", t_hpa, states_hpa)

    # Test 4: Development
    print("\n4. Developmental Boundary Formation")
    print("-" * 60)
    params_dev = get_development_params()
    model_dev = TORDModel(params_dev)
    t_dev, states_dev = model_dev.simulate(
        t_span=(0, 100),
        n_points=2000,
        u_pattern="chronic"
    )
    model_dev.save_trajectory("tord_development.csv", t_dev, states_dev)

    print("\n" + "=" * 60)
    print("All simulations complete. CSV files generated.")
    print("\nNext steps:")
    print("1. Run panel visualizers to see trajectory plots")
    print("2. Analyze coherence metrics and stability")
    print("3. Compare with experimental RT/CA data")
