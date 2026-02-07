#!/usr/bin/env python3
"""
Development Boundary Panel: Mechanotransduction and Fate Specification
=======================================================================

Demonstrates TORD model applied to developmental TAD boundary formation:

Biology:
- Mechanotransduction during morphogenesis
- Tissue stiffness/pressure constraints on chromatin
- TAD boundary establishment via CTCF/cohesin
- Early fate decisions become structurally reinforced

TORD interpretation:
- x(t) = Chromatin accessibility (lineage genes)
- Θ(t) = TAD boundary strength
- u(t) = Mechanical perturbation (stiffness, pressure)
- High κ = strong mechanosensitive reinforcement
- Very low λ = extremely stable boundaries (persist through development)

Clinical hooks:
- Developmental origins of health and disease (DOHaD)
- Congenital disorders (boundary disruption)
- Tissue engineering (recapitulating developmental mechanics)
- Regenerative medicine (boundary respecification)

Author: Michael Kayser
Date: 2025-12-27
"""

import sys
sys.path.append('..')

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from models.tord_core import TORDModel, get_development_params


def create_development_panel(save_path: str = "development_boundary_panel.pdf"):
    """
    Create comprehensive developmental boundary visualization.

    Panels:
    1. Accessibility trajectory under mechanical input
    2. Boundary strength (Θ) establishment
    3. Phase space showing fate commitment
    4. Boundary stability over time
    5. Mechanosensitivity analysis
    6. Clinical interpretation
    """

    # Initialize model with development-specific parameters
    params = get_development_params()
    model = TORDModel(params)

    print("Development Boundary Panel Generation")
    print("=" * 60)
    print("\nParameters (development-optimized):")
    print(f"  κ (reinforcement): {params.kappa:.3f} (very high - strong boundary formation)")
    print(f"  λ (decay): {params.lambda_:.5f} (extremely low - permanent boundaries)")
    print(f"  ω_x (frequency): {params.omega_x:.4f} (faster developmental dynamics)")
    print(f"  μ (mechanosensitivity): {params.mu:.2f}")

    # Simulation: developmental time course (100 hours ~ 4 days)
    t_span = (0, 100)
    n_points = 3000

    # Initial state: pluripotent (low Θ, moderate x)
    initial_state = np.array([0.15, 0.0, 0.05, 0.0, 0.3])

    print("\nRunning simulation...")
    t, states = model.simulate(
        t_span=t_span,
        n_points=n_points,
        initial_state=initial_state,
        u_pattern="chronic"  # Sustained mechanical input
    )

    # Extract state variables
    x = states[:, 0]  # Accessibility
    y = states[:, 2]  # Repair/remodeling activity
    theta = states[:, 4]  # Boundary strength

    # Compute mechanical perturbation
    u = np.array([model.perturbation(ti, "chronic") for ti in t])

    # Compute metrics
    # Boundary establishment rate (early vs late slope)
    t_early = t < 30
    t_late = t > 70

    theta_early_mean = np.mean(theta[t_early])
    theta_late_mean = np.mean(theta[t_late])
    boundary_gain = theta_late_mean - theta_early_mean

    # Fate commitment time (when Θ crosses threshold)
    commitment_threshold = 0.8
    commitment_idx = np.where(theta > commitment_threshold)[0]
    commitment_time = t[commitment_idx[0]] if len(commitment_idx) > 0 else np.inf

    # Accessibility shift (early to late)
    x_early_mean = np.mean(x[t_early])
    x_late_mean = np.mean(x[t_late])
    accessibility_shift = x_late_mean - x_early_mean

    # Create figure
    fig = plt.figure(figsize=(16, 11))
    gs = GridSpec(3, 3, figure=fig, hspace=0.35, wspace=0.3)

    # Color scheme
    color_x = '#6A4C93'      # Accessibility (purple)
    color_theta = '#1982C4'  # Boundary (blue)
    color_mech = '#FF6B35'   # Mechanical input (orange-red)
    color_y = '#8AC926'      # Remodeling (green)

    # Panel 1: Accessibility dynamics (top row)
    ax1 = fig.add_subplot(gs[0, :])

    # Plot mechanical input as background
    ax1_bg = ax1.twinx()
    ax1_bg.fill_between(t, 0, u, alpha=0.15, color=color_mech)
    ax1_bg.plot(t, u, linewidth=1.5, color=color_mech, alpha=0.6,
               label='Mechanical input (stiffness)')
    ax1_bg.set_ylabel('Mechanical perturbation (u)', fontsize=10, color=color_mech)
    ax1_bg.tick_params(axis='y', labelcolor=color_mech)
    ax1_bg.set_ylim([0, 0.5])
    ax1_bg.legend(loc='upper right', fontsize=9)

    # Plot accessibility
    ax1.plot(t, x, linewidth=2.5, color=color_x, label='Chromatin accessibility (x)')

    # Mark commitment time
    if commitment_time != np.inf:
        ax1.axvline(x=commitment_time, color='red', linestyle='--', linewidth=2,
                   alpha=0.7, label=f'Fate commitment ({commitment_time:.1f} hr)')

    # Shade pluripotent vs committed phases
    ax1.axvspan(0, commitment_time if commitment_time != np.inf else t[-1] / 2,
               alpha=0.1, color='yellow', label='Pluripotent')
    if commitment_time != np.inf:
        ax1.axvspan(commitment_time, t[-1], alpha=0.1, color='blue',
                   label='Committed')

    ax1.set_xlabel('Developmental time (hours)', fontsize=11)
    ax1.set_ylabel('Accessibility (x)', fontsize=11, color=color_x)
    ax1.tick_params(axis='y', labelcolor=color_x)
    ax1.set_title('Developmental Boundary Formation: Mechanotransduction → Fate Specification',
                 fontsize=13, fontweight='bold', pad=10)
    ax1.legend(loc='upper left', fontsize=9)
    ax1.grid(True, alpha=0.2)

    # Panel 2: Boundary strength establishment
    ax2 = fig.add_subplot(gs[1, 0])
    ax2.plot(t, theta, linewidth=3, color=color_theta)

    # Mark commitment threshold
    ax2.axhline(y=commitment_threshold, color='red', linestyle='--', linewidth=1.5,
               label=f'Commitment threshold ({commitment_threshold})')

    # Annotate early vs late
    ax2.axhline(y=theta_early_mean, color='orange', linestyle=':', linewidth=1,
               alpha=0.7, label=f'Early Θ = {theta_early_mean:.2f}')
    ax2.axhline(y=theta_late_mean, color='green', linestyle=':', linewidth=1,
               alpha=0.7, label=f'Late Θ = {theta_late_mean:.2f}')

    ax2.set_xlabel('Time (hours)', fontsize=10)
    ax2.set_ylabel('Boundary strength (Θ)', fontsize=10)
    ax2.set_title('TAD Boundary Establishment', fontsize=11, fontweight='bold')
    ax2.legend(loc='lower right', fontsize=8)
    ax2.grid(True, alpha=0.2)

    # Panel 3: Phase space (x vs Θ) showing fate trajectory
    ax3 = fig.add_subplot(gs[1, 1])

    # Color trajectory by time
    scatter = ax3.scatter(x, theta, c=t, cmap='viridis', s=10, alpha=0.6)
    cbar = plt.colorbar(scatter, ax=ax3, label='Time (hr)')

    # Mark start and end
    ax3.scatter(x[0], theta[0], color='red', s=150, marker='o',
               edgecolors='black', linewidths=2, label='Pluripotent', zorder=5)
    ax3.scatter(x[-1], theta[-1], color='blue', s=150, marker='s',
               edgecolors='black', linewidths=2, label='Committed', zorder=5)

    # Draw trajectory arrows
    n_arrows = 6
    arrow_indices = np.linspace(0, len(x) - 100, n_arrows, dtype=int)
    for i in arrow_indices:
        ax3.annotate('', xy=(x[i + 50], theta[i + 50]), xytext=(x[i], theta[i]),
                    arrowprops=dict(arrowstyle='->', color='black', lw=1.5, alpha=0.5))

    ax3.set_xlabel('Accessibility (x)', fontsize=10)
    ax3.set_ylabel('Boundary strength (Θ)', fontsize=10)
    ax3.set_title('Fate Commitment Trajectory', fontsize=11, fontweight='bold')
    ax3.legend(loc='upper left', fontsize=8)
    ax3.grid(True, alpha=0.2)

    # Panel 4: Boundary stability over time
    ax4 = fig.add_subplot(gs[1, 2])

    # Compute rolling variance of Θ
    window = 150
    theta_variance = np.zeros(len(theta))
    for i in range(len(theta)):
        start = max(0, i - window // 2)
        end = min(len(theta), i + window // 2)
        theta_variance[i] = np.var(theta[start:end])

    stability = 1.0 / (1.0 + theta_variance)

    ax4.plot(t, stability, linewidth=2, color='#06A77D')
    ax4.axhline(y=0.95, color='red', linestyle='--', linewidth=1,
               alpha=0.7, label='High stability (>0.95)')

    ax4.set_xlabel('Time (hours)', fontsize=10)
    ax4.set_ylabel('Stability index', fontsize=10)
    ax4.set_title('Boundary Stability: 1/(1+Var(Θ))', fontsize=11, fontweight='bold')
    ax4.set_ylim([0.8, 1.0])
    ax4.legend(fontsize=8)
    ax4.grid(True, alpha=0.2)

    # Panel 5: Mechanosensitivity (x response to u)
    ax5 = fig.add_subplot(gs[2, 0])

    # Cross-correlation between mechanical input and accessibility change
    dx_dt = np.gradient(x, t)

    # Scatter plot
    ax5.scatter(u, dx_dt, c=t, cmap='plasma', s=15, alpha=0.5)
    cbar5 = plt.colorbar(ax5.scatter(u, dx_dt, c=t, cmap='plasma', s=15, alpha=0.5),
                        ax=ax5, label='Time (hr)')

    # Fit linear trend
    from numpy.polynomial import polynomial as P
    coef = P.polyfit(u, dx_dt, 1)
    u_fit = np.linspace(u.min(), u.max(), 100)
    dx_fit = P.polyval(u_fit, coef)
    ax5.plot(u_fit, dx_fit, 'r--', linewidth=2,
            label=f'Sensitivity: {coef[1]:.3f}')

    ax5.set_xlabel('Mechanical input (u)', fontsize=10)
    ax5.set_ylabel('dx/dt', fontsize=10)
    ax5.set_title('Mechanosensitivity', fontsize=11, fontweight='bold')
    ax5.legend(fontsize=8)
    ax5.grid(True, alpha=0.2)

    # Panel 6: Accessibility distribution early vs late
    ax6 = fig.add_subplot(gs[2, 1])

    x_early = x[t_early]
    x_late = x[t_late]

    ax6.hist(x_early, bins=30, alpha=0.6, color='orange',
            label=f'Early (μ={x_early_mean:.3f})', edgecolor='black')
    ax6.hist(x_late, bins=30, alpha=0.6, color='blue',
            label=f'Late (μ={x_late_mean:.3f})', edgecolor='black')

    ax6.set_xlabel('Accessibility (x)', fontsize=10)
    ax6.set_ylabel('Frequency', fontsize=10)
    ax6.set_title('Accessibility Shift: Pluripotent → Committed', fontsize=11, fontweight='bold')
    ax6.legend(fontsize=8)
    ax6.grid(True, alpha=0.2, axis='y')

    # Panel 7: Clinical interpretation
    ax7 = fig.add_subplot(gs[2, 2])
    ax7.axis('off')

    clinical_text = f"""
CLINICAL INTERPRETATION

Developmental Boundary Model

Commitment Metrics:
• Fate commitment: {commitment_time:.1f} hr
• Boundary gain: {boundary_gain:.2f}
• Accessibility shift: {accessibility_shift:.3f}

Mechanotransduction:
→ Stiffness/pressure → chromatin remodeling
→ Activity-dependent boundary formation
→ Irreversible fate specification

Parameters:
• κ = {params.kappa:.2f} (strong reinforcement)
• λ = {params.lambda_:.5f} (permanent boundaries)
• μ = {params.mu:.2f} (mechanosensitivity)

Clinical Applications:
✓ DOHaD: Early mechanical stress → disease risk
✓ Congenital disorders: Boundary disruption
✓ Tissue engineering: Recapitulate mechanics
✓ Regeneration: Boundary respecification

Therapeutic Targets:
• Early intervention (t < {commitment_time:.0f} hr)
• Mechanical modulation (ECM stiffness)
• Boundary stabilizers (CTCF/cohesin)
• Chromatin remodeling factors
    """

    ax7.text(0.05, 0.95, clinical_text.strip(), transform=ax7.transAxes,
            fontsize=8.5, verticalalignment='top', family='monospace',
            bbox=dict(boxstyle='round', facecolor='lightyellow', alpha=0.3))

    # Overall title
    fig.suptitle('Development Boundary Panel: Mechanotransduction → Fate Specification',
                fontsize=15, fontweight='bold', y=0.98)

    # Save
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\n✓ Panel saved to {save_path}")

    # Save data
    data_path = save_path.replace('.pdf', '.csv')
    model.save_trajectory(data_path, t, states)

    # Summary statistics
    print("\n" + "=" * 60)
    print("DEVELOPMENT BOUNDARY PANEL SUMMARY")
    print("=" * 60)
    print(f"Simulation duration: {t_span[1]} hours ({t_span[1]/24:.1f} days)")
    print(f"\nBoundary establishment:")
    print(f"  Initial Θ: {theta_early_mean:.3f}")
    print(f"  Final Θ:   {theta_late_mean:.3f}")
    print(f"  Gain:      {boundary_gain:.3f}")
    print(f"\nFate commitment:")
    print(f"  Commitment time: {commitment_time:.1f} hours")
    print(f"  Accessibility shift: {accessibility_shift:.3f}")
    print(f"\n✓ Development boundary panel complete")

    return fig, (t, states)


if __name__ == "__main__":
    print("Generating Development Boundary Panel...")
    fig, (t, states) = create_development_panel("development_boundary_panel.pdf")
    print("\nPanel generation complete.")
