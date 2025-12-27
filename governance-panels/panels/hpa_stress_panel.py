#!/usr/bin/env python3
"""
HPA Stress Panel: Neuroendocrine Resilience and Recovery
=========================================================

Demonstrates TORD model applied to HPA axis stress response:

Biology:
- Glucocorticoid receptor (NR3C1) dynamics
- FKBP5 feedback loop (stress sensitivity)
- Chromatin remodeling under repeated stress
- Inflammation coupling (IL-6, TNF-α)

TORD interpretation:
- x(t) = GR accessibility (promoter opening)
- y(t) = Stress response amplitude
- Θ(t) = Resilience capacity (boundary integrity)
- u(t) = Stress pulse trains
- η = Delayed negative feedback (FKBP5 loop ~ 2-4hr)

Clinical hooks:
- HRV biofeedback protocols
- Dissociative episode reduction
- PTSD treatment monitoring
- Burnout prevention (boundary erosion tracking)

Author: Michael Kayser
Date: 2025-12-27
"""

import sys
sys.path.append('..')

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from models.tord_core import TORDModel, get_hpa_stress_params


def create_hpa_stress_panel(save_path: str = "hpa_stress_panel.pdf"):
    """
    Create comprehensive HPA stress response visualization.

    Panels:
    1. GR accessibility under repeated stress
    2. Stress response amplitude (y) with fatigue
    3. Resilience capacity (Θ) erosion/recovery
    4. Phase space with stress trajectory
    5. Recovery metrics
    6. Clinical interpretation
    """

    # Initialize model with HPA-specific parameters
    params = get_hpa_stress_params()
    model = TORDModel(params)

    print("HPA Stress Panel Generation")
    print("=" * 60)
    print("\nParameters (HPA-optimized):")
    print(f"  μ (stress coupling): {params.mu:.3f} (high - strong perturbation)")
    print(f"  λ (boundary decay): {params.lambda_:.3f} (moderate - stress erosion)")
    print(f"  γ_y (repair fatigue): {params.gamma_y:.3f} (increased under chronic stress)")
    print(f"  η (feedback delay): {params.eta:.2f} hr (FKBP5 loop)")

    # Simulation: 5 days with repeated stress
    t_span = (0, 120)  # 5 days
    n_points = 4000

    # Initial state: healthy baseline
    initial_state = np.array([0.08, 0.0, 0.03, 0.0, 1.2])

    print("\nRunning simulation...")
    t, states = model.simulate(
        t_span=t_span,
        n_points=n_points,
        initial_state=initial_state,
        u_pattern="stress"
    )

    # Extract state variables
    x = states[:, 0]  # GR accessibility
    y = states[:, 2]  # Stress response
    theta = states[:, 4]  # Resilience capacity

    # Compute stress perturbation for visualization
    u = np.array([model.perturbation(ti, "stress") for ti in t])

    # Compute metrics
    # Resilience erosion rate (slope of Θ over time)
    t_mid = len(t) // 2
    theta_early = np.mean(theta[:t_mid])
    theta_late = np.mean(theta[t_mid:])
    erosion_rate = (theta_late - theta_early) / (t[t_mid] - t[0])

    # Peak response amplitude
    peak_response = np.max(np.abs(y))

    # Recovery time (time for x to return to baseline after last stress)
    last_stress_idx = np.where(u > 0.1)[0][-1] if np.any(u > 0.1) else 0
    x_baseline = np.mean(x[:100])  # Initial baseline
    recovery_mask = (t > t[last_stress_idx]) & (np.abs(x - x_baseline) < 0.02)
    recovery_time = t[np.where(recovery_mask)[0][0]] - t[last_stress_idx] if np.any(recovery_mask) else np.inf

    # Create figure
    fig = plt.figure(figsize=(16, 11))
    gs = GridSpec(3, 3, figure=fig, hspace=0.35, wspace=0.3)

    # Color scheme
    color_x = '#2E86AB'      # GR accessibility (blue)
    color_y = '#C73E1D'      # Stress response (red)
    color_theta = '#06A77D'  # Resilience (green)
    color_stress = '#F18F01' # Stress input (orange)

    # Panel 1: GR accessibility with stress pulses (top row)
    ax1 = fig.add_subplot(gs[0, :])

    # Plot stress pulses as background
    ax1_bg = ax1.twinx()
    ax1_bg.fill_between(t, 0, u, alpha=0.15, color=color_stress)
    ax1_bg.set_ylabel('Stress input (u)', fontsize=10, color=color_stress)
    ax1_bg.tick_params(axis='y', labelcolor=color_stress)
    ax1_bg.set_ylim([0, 1.2])

    # Plot GR accessibility
    ax1.plot(t, x, linewidth=2, color=color_x, label='GR accessibility (x)')
    ax1.axhline(y=x_baseline, color='gray', linestyle='--', linewidth=1,
               alpha=0.7, label=f'Baseline = {x_baseline:.3f}')

    ax1.set_xlabel('Time (hours)', fontsize=11)
    ax1.set_ylabel('GR accessibility (x)', fontsize=11, color=color_x)
    ax1.tick_params(axis='y', labelcolor=color_x)
    ax1.set_title('HPA Axis: Glucocorticoid Receptor Dynamics Under Repeated Stress',
                 fontsize=13, fontweight='bold', pad=10)
    ax1.legend(loc='upper left', fontsize=9)
    ax1.grid(True, alpha=0.2)

    # Panel 2: Stress response amplitude
    ax2 = fig.add_subplot(gs[1, 0])
    ax2.plot(t, y, linewidth=2, color=color_y)
    ax2.axhline(y=0, color='gray', linestyle='-', linewidth=0.5, alpha=0.5)
    ax2.axhline(y=peak_response, color='black', linestyle='--', linewidth=1,
               label=f'Peak = {peak_response:.3f}')

    ax2.set_xlabel('Time (hours)', fontsize=10)
    ax2.set_ylabel('Stress response (y)', fontsize=10)
    ax2.set_title('Response Amplitude: Fatigue Accumulation', fontsize=11, fontweight='bold')
    ax2.legend(loc='upper right', fontsize=8)
    ax2.grid(True, alpha=0.2)

    # Panel 3: Resilience capacity (Θ)
    ax3 = fig.add_subplot(gs[1, 1])
    ax3.plot(t, theta, linewidth=2.5, color=color_theta)
    ax3.axhline(y=theta_early, color='green', linestyle='--', linewidth=1,
               alpha=0.7, label=f'Early = {theta_early:.2f}')
    ax3.axhline(y=theta_late, color='red', linestyle='--', linewidth=1,
               alpha=0.7, label=f'Late = {theta_late:.2f}')

    # Annotate erosion
    ax3.annotate('', xy=(t[-1], theta_late), xytext=(t[-1], theta_early),
                arrowprops=dict(arrowstyle='<->', color='black', lw=1.5))
    ax3.text(t[-1] * 1.02, (theta_early + theta_late) / 2,
            f'Erosion\n{theta_early - theta_late:.3f}',
            fontsize=9, va='center')

    ax3.set_xlabel('Time (hours)', fontsize=10)
    ax3.set_ylabel('Resilience capacity (Θ)', fontsize=10)
    ax3.set_title('Boundary Integrity: Stress-Induced Erosion', fontsize=11, fontweight='bold')
    ax3.legend(loc='upper right', fontsize=8)
    ax3.grid(True, alpha=0.2)

    # Panel 4: Phase space (x vs y) colored by Θ
    ax4 = fig.add_subplot(gs[1, 2])

    # Color by resilience capacity
    scatter = ax4.scatter(x, y, c=theta, cmap='RdYlGn', s=5, alpha=0.6)
    cbar = plt.colorbar(scatter, ax=ax4, label='Resilience (Θ)')

    # Mark trajectory direction
    n_arrows = 8
    arrow_indices = np.linspace(0, len(x) - 1, n_arrows, dtype=int)
    for i in arrow_indices[:-1]:
        ax4.annotate('', xy=(x[i + 50], y[i + 50]), xytext=(x[i], y[i]),
                    arrowprops=dict(arrowstyle='->', color='black', lw=1, alpha=0.4))

    ax4.set_xlabel('GR accessibility (x)', fontsize=10)
    ax4.set_ylabel('Stress response (y)', fontsize=10)
    ax4.set_title('Phase Portrait: Resilience Trajectory', fontsize=11, fontweight='bold')
    ax4.grid(True, alpha=0.2)
    ax4.axhline(0, color='gray', linewidth=0.5)
    ax4.axvline(0, color='gray', linewidth=0.5)

    # Panel 5: Recovery dynamics
    ax5 = fig.add_subplot(gs[2, 0])

    # Focus on last stress pulse and recovery
    if last_stress_idx > 0:
        recovery_window = slice(max(0, last_stress_idx - 200), min(len(t), last_stress_idx + 500))
        t_rec = t[recovery_window] - t[last_stress_idx]  # Relative to last stress
        x_rec = x[recovery_window]

        ax5.plot(t_rec, x_rec, linewidth=2, color=color_x)
        ax5.axhline(y=x_baseline, color='gray', linestyle='--', linewidth=1,
                   label='Baseline')
        ax5.axvline(x=0, color=color_stress, linestyle=':', linewidth=2,
                   alpha=0.7, label='Last stress')

        # Mark recovery point
        if recovery_time != np.inf:
            ax5.axvline(x=recovery_time, color='green', linestyle='--', linewidth=1.5,
                       label=f'Recovery: {recovery_time:.1f} hr')

    ax5.set_xlabel('Time from last stress (hours)', fontsize=10)
    ax5.set_ylabel('GR accessibility (x)', fontsize=10)
    ax5.set_title('Recovery Dynamics', fontsize=11, fontweight='bold')
    ax5.legend(loc='upper right', fontsize=8)
    ax5.grid(True, alpha=0.2)

    # Panel 6: Stress-response histogram
    ax6 = fig.add_subplot(gs[2, 1])

    # Compare early vs late stress responses
    stress_periods = u > 0.1
    y_during_stress = y[stress_periods]
    early_stress = y_during_stress[:len(y_during_stress) // 2]
    late_stress = y_during_stress[len(y_during_stress) // 2:]

    ax6.hist(early_stress, bins=30, alpha=0.6, color='green',
            label=f'Early (μ={np.mean(early_stress):.3f})', edgecolor='black')
    ax6.hist(late_stress, bins=30, alpha=0.6, color='red',
            label=f'Late (μ={np.mean(late_stress):.3f})', edgecolor='black')

    ax6.set_xlabel('Stress response (y)', fontsize=10)
    ax6.set_ylabel('Frequency', fontsize=10)
    ax6.set_title('Response Distribution: Early vs Late', fontsize=11, fontweight='bold')
    ax6.legend(fontsize=8)
    ax6.grid(True, alpha=0.2, axis='y')

    # Panel 7: Clinical interpretation
    ax7 = fig.add_subplot(gs[2, 2])
    ax7.axis('off')

    clinical_text = f"""
CLINICAL INTERPRETATION

HPA Axis Governance Model

Resilience Metrics:
• Erosion rate: {erosion_rate:.4f}/hr
• Peak response: {peak_response:.3f}
• Recovery time: {recovery_time:.1f} hr

Stress-Induced Changes:
→ Boundary decay (λ={params.lambda_:.2f})
→ Repair fatigue (γ_y={params.gamma_y:.2f})
→ Delayed feedback (η={params.eta:.1f}hr)

Clinical Applications:
✓ HRV biofeedback optimization
✓ Dissociation episode prediction
✓ Burnout risk assessment
✓ PTSD treatment monitoring

Therapeutic Targets:
• ↑ Resilience (Θ): Anti-inflammatory
• ↓ Erosion rate: Boundary stabilizers
• ↑ Recovery speed: Vagal tone training
• Optimize η: FKBP5 modulation

Intervention Timing:
→ Early intervention (high Θ): Best outcome
→ Chronic stress (low Θ): Requires boundary
   repair before symptom reduction
    """

    ax7.text(0.05, 0.95, clinical_text.strip(), transform=ax7.transAxes,
            fontsize=8.5, verticalalignment='top', family='monospace',
            bbox=dict(boxstyle='round', facecolor='lightblue', alpha=0.3))

    # Overall title
    fig.suptitle('HPA Stress Panel: Neuroendocrine Resilience Dynamics',
                fontsize=15, fontweight='bold', y=0.98)

    # Save
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\n✓ Panel saved to {save_path}")

    # Save data
    data_path = save_path.replace('.pdf', '.csv')
    model.save_trajectory(data_path, t, states)

    # Summary statistics
    print("\n" + "=" * 60)
    print("HPA STRESS PANEL SUMMARY")
    print("=" * 60)
    print(f"Simulation duration: {t_span[1]} hours ({t_span[1]/24:.1f} days)")
    print(f"\nResilience dynamics:")
    print(f"  Initial Θ: {theta_early:.3f}")
    print(f"  Final Θ:   {theta_late:.3f}")
    print(f"  Erosion:   {theta_early - theta_late:.3f}")
    print(f"  Rate:      {erosion_rate:.5f} per hour")
    print(f"\nStress response:")
    print(f"  Peak amplitude: {peak_response:.3f}")
    print(f"  Recovery time:  {recovery_time:.1f} hours")
    print(f"\n✓ HPA stress panel complete")

    return fig, (t, states)


if __name__ == "__main__":
    print("Generating HPA Stress Panel...")
    fig, (t, states) = create_hpa_stress_panel("hpa_stress_panel.pdf")
    print("\nPanel generation complete.")
    print("Next: Run Development Boundary Panel")
