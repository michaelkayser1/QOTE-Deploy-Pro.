#!/usr/bin/env python3
"""
Figure 3: Effective theta-angle evolution under observer coupling
Shows exponential suppression of CP violation with coherence
"""

import numpy as np
import matplotlib.pyplot as plt

# Golden ratio
PHI = (1 + np.sqrt(5)) / 2
PHI_INV = 1 / PHI

# Parameters
THETA_0 = 1.0  # Natural O(1) bare theta angle
BETA = 23.0    # Coupling strength (chosen to match experimental bounds)

# Experimental bounds on theta
THETA_UPPER_BOUND = 1e-10  # Current experimental limit

# Coherence range
C = np.linspace(0, 1, 1000)

# Effective theta angle: theta_eff = theta_0 * exp(-beta * C)
theta_eff = THETA_0 * np.exp(-BETA * C)

# Create figure with two panels
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 9))

# Panel 1: Log scale plot showing full suppression
ax1.semilogy(C, theta_eff, 'b-', linewidth=2.5, label=r'$\theta_{\mathrm{eff}} = \theta_0 e^{-\beta C}$')

# Mark the coherence threshold
theta_at_phi_inv = THETA_0 * np.exp(-BETA * PHI_INV)
ax1.semilogy(PHI_INV, theta_at_phi_inv, 'go', markersize=12,
             label=f'At φ⁻¹: θ = {theta_at_phi_inv:.2e}', zorder=5)

# Experimental constraint region
ax1.axhspan(0, THETA_UPPER_BOUND, alpha=0.2, color='gray',
            label=f'Observational limit: |θ| < {THETA_UPPER_BOUND:.0e}')
ax1.axhline(y=THETA_UPPER_BOUND, color='red', linestyle='--',
            linewidth=2, alpha=0.7)

# Mark natural scale
ax1.axhline(y=THETA_0, color='orange', linestyle=':', linewidth=2,
            label=r'$\theta_0$ (natural scale)', alpha=0.7)

# Shade coherent regime
ax1.axvspan(PHI_INV, 1, alpha=0.1, color='green', label='Coherent regime')

ax1.set_xlabel('Observer Coherence C', fontsize=12)
ax1.set_ylabel(r'$|\theta_{\mathrm{eff}}|$', fontsize=12)
ax1.set_title('Strong CP Suppression via Observer Coupling', fontsize=13, fontweight='bold')
ax1.legend(loc='upper right', fontsize=10)
ax1.grid(True, alpha=0.3, which='both')
ax1.set_ylim([1e-12, 10])
ax1.set_xlim([0, 1])

# Panel 2: Linear scale focusing on low coherence regime
C_zoom = np.linspace(0, 0.3, 500)
theta_eff_zoom = THETA_0 * np.exp(-BETA * C_zoom)

ax2.plot(C_zoom, theta_eff_zoom, 'b-', linewidth=2.5)
ax2.fill_between(C_zoom, 0, theta_eff_zoom, alpha=0.3, color='blue',
                 label='CP-violating regime')

# Show different bare theta values
for theta0_alt, color, label in zip([0.5, 1.0, 2.0],
                                     ['green', 'blue', 'red'],
                                     [r'$\theta_0 = 0.5$', r'$\theta_0 = 1.0$', r'$\theta_0 = 2.0$']):
    theta_alt = theta0_alt * np.exp(-BETA * C_zoom)
    ax2.plot(C_zoom, theta_alt, linewidth=2, label=label, color=color, alpha=0.7)

ax2.set_xlabel('Observer Coherence C', fontsize=12)
ax2.set_ylabel(r'$\theta_{\mathrm{eff}}$', fontsize=12)
ax2.set_title('Low Coherence Regime (Linear Scale)', fontsize=13, fontweight='bold')
ax2.legend(loc='upper right', fontsize=10)
ax2.grid(True, alpha=0.3)
ax2.set_xlim([0, 0.3])
ax2.set_ylim([0, 2.5])

# Add text annotation explaining mechanism
textstr = 'Mechanism: Observer coherence\n'
textstr += 'couples to QCD θ-term via\n'
textstr += 'Einstein-Cartan torsion,\n'
textstr += 'exponentially suppressing\n'
textstr += 'CP violation.\n\n'
textstr += f'Required: β ≈ {BETA:.0f}\n'
textstr += f'to match |θ| < 10⁻¹⁰'

props = dict(boxstyle='round', facecolor='wheat', alpha=0.6)
ax2.text(0.98, 0.97, textstr, transform=ax2.transAxes, fontsize=9,
         verticalalignment='top', horizontalalignment='right', bbox=props)

plt.tight_layout()
plt.savefig('fig3_ghost_stabilization.pdf', dpi=300, bbox_inches='tight')
print("Figure 3 generated: fig3_ghost_stabilization.pdf")
print(f"theta_eff at C=phi^{{-1}}: {theta_at_phi_inv:.3e}")
print(f"Suppression factor: {THETA_0/theta_at_phi_inv:.3e}")
plt.close()
