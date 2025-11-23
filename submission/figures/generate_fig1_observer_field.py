#!/usr/bin/env python3
"""
Figure 1: Observer field amplitude evolution across coherence threshold
Shows transition from chaotic to coherent regime at C = phi^{-1}
"""

import numpy as np
import matplotlib.pyplot as plt
from scipy.integrate import odeint

# Golden ratio
PHI = (1 + np.sqrt(5)) / 2
PHI_INV = 1 / PHI

# Parameters
LAMBDA = 1.0
V0 = 1.0
M_PHI_SQ = 4 * LAMBDA * V0**2

def observer_field_eom(y, t, coherence):
    """
    Observer field equation of motion
    y = [O_real, O_imag, dO_real/dt, dO_imag/dt]
    """
    O_re, O_im, dO_re, dO_im = y
    O_mag_sq = O_re**2 + O_im**2

    # Potential term: -dV/dO = -2*lambda*(|O|^2 - v0^2)*O
    V_prime_re = -2 * LAMBDA * (O_mag_sq - V0**2) * O_re
    V_prime_im = -2 * LAMBDA * (O_mag_sq - V0**2) * O_im

    # Damping term (models decoherence)
    gamma = 2.0 * (1 - coherence)

    # d^2O/dt^2 + gamma*dO/dt + dV/dO = 0
    ddO_re = V_prime_re - gamma * dO_re
    ddO_im = V_prime_im - gamma * dO_im

    return [dO_re, dO_im, ddO_re, ddO_im]

# Time array
t = np.linspace(0, 50, 2000)

# Initial conditions: small perturbation from vacuum
y0 = [0.9 * V0, 0.1 * V0, 0.0, 0.1]

# Solve for different coherence values
coherence_values = [0.3, 0.5, PHI_INV, 0.7, 0.9]
colors = ['#d62728', '#ff7f0e', '#2ca02c', '#1f77b4', '#9467bd']
labels = ['C = 0.3', 'C = 0.5', f'C = φ⁻¹ ≈ {PHI_INV:.3f}', 'C = 0.7', 'C = 0.9']

fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 8))

for coherence, color, label in zip(coherence_values, colors, labels):
    sol = odeint(observer_field_eom, y0, t, args=(coherence,))
    O_mag = np.sqrt(sol[:, 0]**2 + sol[:, 1]**2) / V0

    if coherence == PHI_INV:
        ax1.plot(t, O_mag, color=color, linewidth=2.5, label=label, zorder=10)
    else:
        ax1.plot(t, O_mag, color=color, linewidth=1.5, alpha=0.7, label=label)

# Shade the region below phi^{-1}
ax1.axhspan(0, 1, alpha=0.15, color='gray', label='Decoherent regime')
ax1.axhline(y=1, color='black', linestyle='--', linewidth=1, alpha=0.5)
ax1.axhline(y=PHI_INV, color='green', linestyle=':', linewidth=2, alpha=0.7, label=f'Threshold φ⁻¹')

ax1.set_xlabel('Time (arbitrary units)', fontsize=12)
ax1.set_ylabel('|O| / v₀', fontsize=12)
ax1.set_title('Observer Field Amplitude Across Coherence Threshold', fontsize=13, fontweight='bold')
ax1.legend(loc='upper right', fontsize=9)
ax1.grid(True, alpha=0.3)
ax1.set_ylim([0, 1.3])

# Panel 2: Phase space portrait at critical coherence
coherence_critical = PHI_INV
sol_critical = odeint(observer_field_eom, y0, t, args=(coherence_critical,))

# Create phase space plot
O_re = sol_critical[:, 0] / V0
O_im = sol_critical[:, 1] / V0

# Color by time
scatter = ax2.scatter(O_re, O_im, c=t, cmap='viridis', s=10, alpha=0.6)
ax2.plot(O_re[0], O_im[0], 'go', markersize=10, label='Initial state', zorder=5)
ax2.plot(O_re[-1], O_im[-1], 'ro', markersize=10, label='Final state', zorder=5)

# Draw unit circle (coherent manifold)
theta = np.linspace(0, 2*np.pi, 100)
ax2.plot(np.cos(theta), np.sin(theta), 'k--', linewidth=2, alpha=0.5, label='Coherent manifold')

ax2.set_xlabel('Re(O) / v₀', fontsize=12)
ax2.set_ylabel('Im(O) / v₀', fontsize=12)
ax2.set_title(f'Phase Portrait at Critical Coherence C = φ⁻¹', fontsize=13, fontweight='bold')
ax2.legend(loc='upper right', fontsize=9)
ax2.grid(True, alpha=0.3)
ax2.set_aspect('equal')
ax2.set_xlim([-1.2, 1.2])
ax2.set_ylim([-1.2, 1.2])

# Add colorbar
cbar = plt.colorbar(scatter, ax=ax2)
cbar.set_label('Time', fontsize=10)

plt.tight_layout()
plt.savefig('fig1_observer_field.pdf', dpi=300, bbox_inches='tight')
print("Figure 1 generated: fig1_observer_field.pdf")
plt.close()
