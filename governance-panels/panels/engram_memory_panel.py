#!/usr/bin/env python3
"""
Engram Memory Panel: Persistent Chromatin Loops as Memory Substrates
=====================================================================

Demonstrates TORD model applied to engram neuron biology:

Biology (Chen et al. Nature Neurosci 2024):
- Engram neurons form persistent chromatin loops at learning genes
- Loops last weeks, stable across recall events
- Peripheral genes drift (noise tolerance)
- Loop stability correlates with memory strength

TORD interpretation:
- x(t) = Chromatin accessibility at learning loci
- Θ(t) = Loop persistence (boundary strength)
- u(t) = Recall pulses (neural activity)
- High κ, low λ = stable engram encoding

Clinical hooks:
- Memory consolidation protocols
- PTSD reconsolidation therapy
- Learning optimization
- Alzheimer's early detection (loop instability)

Author: Michael Kayser
Date: 2025-12-27
"""

import sys
sys.path.append('..')

import numpy as np
import matplotlib.pyplot as plt
from matplotlib.gridspec import GridSpec
from models.tord_core import TORDModel, get_engram_params


def create_engram_panel(save_path: str = "engram_memory_panel.pdf"):
    """
    Create comprehensive engram memory visualization.

    Panels:
    1. Chromatin accessibility trajectory with recall pulses
    2. Loop persistence (Θ) over time
    3. Phase space (x vs y)
    4. Stability metrics
    """

    # Initialize model with engram-specific parameters
    params = get_engram_params()
    model = TORDModel(params)

    print("Engram Memory Panel Generation")
    print("=" * 60)
    print("\nParameters (engram-optimized):")
    print(f"  κ (reinforcement): {params.kappa:.3f} (high - strong loop formation)")
    print(f"  λ (decay): {params.lambda_:.4f} (low - weeks-long persistence)")
    print(f"  ω_x (frequency): {params.omega_x:.4f} (slow - stable dynamics)")
    print(f"  η (delay): {params.eta:.2f} hr")

    # Simulation parameters
    t_span = (0, 240)  # 10 days (240 hours)
    n_points = 5000

    # Initial state: neutral baseline
    initial_state = np.array([0.05, 0.0, 0.02, 0.0, 0.8])

    # Run simulation with recall protocol
    print("\nRunning simulation...")
    t, states = model.simulate(
        t_span=t_span,
        n_points=n_points,
        initial_state=initial_state,
        u_pattern="recall"
    )

    # Extract state variables
    x = states[:, 0]  # Accessibility
    y = states[:, 2]  # Repair activity
    theta = states[:, 4]  # Loop persistence

    # Compute recall perturbation for visualization
    u = np.array([model.perturbation(ti, "recall") for ti in t])

    # Compute metrics
    theta_mean = np.mean(theta[t > 50])  # After initial transient
    theta_std = np.std(theta[t > 50])
    theta_stability = 1.0 / (1.0 + theta_std)

    # Accessibility variance (noise tolerance)
    x_std = np.std(x[t > 50])

    # Create figure
    fig = plt.figure(figsize=(16, 10))
    gs = GridSpec(3, 3, figure=fig, hspace=0.3, wspace=0.3)

    # Color scheme
    color_x = '#2E86AB'      # Accessibility (blue)
    color_theta = '#A23B72'  # Loop persistence (magenta)
    color_recall = '#F18F01' # Recall pulses (orange)
    color_y = '#C73E1D'      # Repair activity (red)

    # Panel 1: Accessibility with recall pulses (top row, full width)
    ax1 = fig.add_subplot(gs[0, :])

    # Plot recall pulses as background
    ax1_bg = ax1.twinx()
    ax1_bg.fill_between(t, 0, u, alpha=0.15, color=color_recall,
                         label='Recall pulses')
    ax1_bg.set_ylabel('Recall stimulus (u)', fontsize=10, color=color_recall)
    ax1_bg.tick_params(axis='y', labelcolor=color_recall)
    ax1_bg.set_ylim([0, 1.5])

    # Plot accessibility
    ax1.plot(t, x, linewidth=2, color=color_x, label='Chromatin accessibility (x)')
    ax1.axhline(y=0, color='gray', linestyle='--', linewidth=0.8, alpha=0.5)
    ax1.set_xlabel('Time (hours)', fontsize=11)
    ax1.set_ylabel('Accessibility (x)', fontsize=11, color=color_x)
    ax1.tick_params(axis='y', labelcolor=color_x)
    ax1.set_title('Engram Formation: Persistent Accessibility at Learning Loci',
                 fontsize=13, fontweight='bold', pad=10)

    # Mark recall times
    recall_times = [10, 20, 30]
    for tr in recall_times:
        ax1.axvline(x=tr, color=color_recall, linestyle=':', alpha=0.6, linewidth=1.5)
        ax1.text(tr, ax1.get_ylim()[1] * 0.9, f'R{recall_times.index(tr)+1}',
                ha='center', fontsize=9, color=color_recall, fontweight='bold')

    ax1.grid(True, alpha=0.2)
    ax1.legend(loc='upper left', fontsize=9)

    # Panel 2: Loop persistence (Θ)
    ax2 = fig.add_subplot(gs[1, 0])
    ax2.plot(t, theta, linewidth=2, color=color_theta)
    ax2.axhline(y=theta_mean, color='black', linestyle='--', linewidth=1,
               label=f'Mean Θ = {theta_mean:.2f}')
    ax2.fill_between(t, theta_mean - theta_std, theta_mean + theta_std,
                     alpha=0.2, color=color_theta, label=f'±1 SD = {theta_std:.3f}')
    ax2.set_xlabel('Time (hours)', fontsize=10)
    ax2.set_ylabel('Loop persistence (Θ)', fontsize=10)
    ax2.set_title('Boundary Strength: Stable Engram Encoding', fontsize=11, fontweight='bold')
    ax2.legend(loc='lower right', fontsize=8)
    ax2.grid(True, alpha=0.2)

    # Panel 3: Phase space (x vs y)
    ax3 = fig.add_subplot(gs[1, 1])

    # Color trajectory by time
    scatter = ax3.scatter(x, y, c=t, cmap='viridis', s=5, alpha=0.6)
    cbar = plt.colorbar(scatter, ax=ax3, label='Time (hr)')

    # Mark recall events
    recall_indices = [np.argmin(np.abs(t - tr)) for tr in recall_times]
    ax3.scatter(x[recall_indices], y[recall_indices], color=color_recall,
               s=100, marker='*', edgecolors='black', linewidths=1.5,
               label='Recall events', zorder=5)

    ax3.set_xlabel('Accessibility (x)', fontsize=10)
    ax3.set_ylabel('Repair activity (y)', fontsize=10)
    ax3.set_title('Phase Portrait: Attractor Dynamics', fontsize=11, fontweight='bold')
    ax3.legend(loc='upper left', fontsize=8)
    ax3.grid(True, alpha=0.2)
    ax3.axhline(0, color='gray', linewidth=0.5)
    ax3.axvline(0, color='gray', linewidth=0.5)

    # Panel 4: Stability metric over time
    ax4 = fig.add_subplot(gs[1, 2])

    # Compute rolling stability
    window = 200
    stability = np.zeros(len(theta))
    for i in range(len(theta)):
        start = max(0, i - window // 2)
        end = min(len(theta), i + window // 2)
        theta_window = theta[start:end]
        stability[i] = 1.0 / (1.0 + np.std(theta_window))

    ax4.plot(t, stability, linewidth=2, color='#06A77D')
    ax4.axhline(y=theta_stability, color='black', linestyle='--', linewidth=1,
               label=f'Mean stability = {theta_stability:.3f}')
    ax4.set_xlabel('Time (hours)', fontsize=10)
    ax4.set_ylabel('Stability index', fontsize=10)
    ax4.set_title('Memory Stability: 1/(1+σ(Θ))', fontsize=11, fontweight='bold')
    ax4.set_ylim([0.5, 1.0])
    ax4.legend(loc='lower right', fontsize=8)
    ax4.grid(True, alpha=0.2)

    # Panel 5: Accessibility distribution (peripheral noise tolerance)
    ax5 = fig.add_subplot(gs[2, 0])

    # Split into learning loci (high x) and peripheral (low x)
    x_post = x[t > 50]  # After learning
    ax5.hist(x_post, bins=40, color=color_x, alpha=0.7, edgecolor='black')
    ax5.axvline(x=np.mean(x_post), color='red', linestyle='--', linewidth=2,
               label=f'Mean = {np.mean(x_post):.3f}')
    ax5.axvline(x=np.median(x_post), color='orange', linestyle=':', linewidth=2,
               label=f'Median = {np.median(x_post):.3f}')

    ax5.set_xlabel('Accessibility (x)', fontsize=10)
    ax5.set_ylabel('Frequency', fontsize=10)
    ax5.set_title('Accessibility Distribution (post-learning)', fontsize=11, fontweight='bold')
    ax5.legend(fontsize=8)
    ax5.grid(True, alpha=0.2, axis='y')

    # Panel 6: Clinical interpretation
    ax6 = fig.add_subplot(gs[2, 1:])
    ax6.axis('off')

    clinical_text = f"""
CLINICAL INTERPRETATION: Engram-Based Memory Governance

Biological Grounding:
• Persistent chromatin loops at learning genes (Chen et al. Nature Neurosci 2024)
• Loops stable for weeks, correlate with memory retention
• Peripheral loci show drift (noise tolerance without information loss)

TORD Model Results:
• Loop persistence (Θ): {theta_mean:.2f} ± {theta_std:.3f}
• Stability index: {theta_stability:.3f} (high = stable engram)
• Accessibility variance: {x_std:.3f} (controlled fluctuations)

Memory Consolidation Protocol:
1. Repeated recall at 10, 20, 30 hr → reinforces loop formation
2. High κ = {params.kappa:.2f} → strong activity-dependent boundaries
3. Low λ = {params.lambda_:.4f} → weeks-long persistence (vs. hours for non-engrams)

Clinical Applications:
✓ Memory consolidation therapy (optimize recall timing)
✓ PTSD reconsolidation (controlled loop disruption)
✓ Learning enhancement (strengthen encoding parameters)
✓ Early Alzheimer's detection (measure loop instability)

Therapeutic Targets:
→ HDAC inhibitors (increase κ - strengthen loop formation)
→ CTCF stabilizers (decrease λ - prolong persistence)
→ Activity-based training (optimize u(t) - recall protocols)
    """

    ax6.text(0.05, 0.95, clinical_text.strip(), transform=ax6.transAxes,
            fontsize=9, verticalalignment='top', family='monospace',
            bbox=dict(boxstyle='round', facecolor='wheat', alpha=0.3))

    # Overall title
    fig.suptitle('Engram Memory Panel: Topology as Information Substrate',
                fontsize=15, fontweight='bold', y=0.98)

    # Save
    plt.savefig(save_path, dpi=300, bbox_inches='tight')
    print(f"\n✓ Panel saved to {save_path}")

    # Save data
    data_path = save_path.replace('.pdf', '.csv')
    model.save_trajectory(data_path, t, states)

    # Summary statistics
    print("\n" + "=" * 60)
    print("ENGRAM PANEL SUMMARY")
    print("=" * 60)
    print(f"Simulation duration: {t_span[1]} hours ({t_span[1]/24:.1f} days)")
    print(f"Recall protocol: 3 pulses at {recall_times} hr")
    print(f"\nLoop persistence (Θ):")
    print(f"  Mean: {theta_mean:.3f}")
    print(f"  Std:  {theta_std:.4f}")
    print(f"  Stability: {theta_stability:.3f}")
    print(f"\nAccessibility dynamics:")
    print(f"  Post-learning mean: {np.mean(x_post):.3f}")
    print(f"  Post-learning std:  {x_std:.3f}")
    print(f"  Noise tolerance: {x_std / np.abs(np.mean(x_post)):.2f} (relative)")
    print("\n✓ Engram panel complete")

    return fig, (t, states)


if __name__ == "__main__":
    print("Generating Engram Memory Panel...")
    fig, (t, states) = create_engram_panel("engram_memory_panel.pdf")
    print("\nPanel generation complete.")
    print("Next: Run HPA Stress Panel")
