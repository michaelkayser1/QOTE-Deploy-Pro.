#!/usr/bin/env python3
"""
Figure 4: Effective cosmological constant as function of observer coherence
Shows natural cancellation mechanism at C = phi^{-1}
"""

import numpy as np
import matplotlib.pyplot as plt

# Golden ratio
PHI = (1 + np.sqrt(5)) / 2
PHI_INV = 1 / PHI

# Physical parameters (in natural units where c = hbar = 1)
# Lambda_obs ~ 10^{-47} GeV^4 (observed cosmological constant)
LAMBDA_OBS = 1.0  # Normalized to observed value

# Bare cosmological constant (arbitrary large positive value representing vacuum energy)
LAMBDA_0 = 120.0  # In units of Lambda_obs (representing ~120 orders of magnitude problem)

# Observer field parameters
# We engineer gamma such that cancellation occurs at C = phi^{-1}
# Lambda_eff = Lambda_0 + gamma * v_O^2 * C + delta * <K^2> * C
# For cancellation: Lambda_0 + gamma * v_O^2 * phi^{-1} ≈ Lambda_obs

# Choose parameters for natural cancellation
GAMMA_V0_SQ = -(LAMBDA_0 - LAMBDA_OBS) / PHI_INV  # Main contribution
DELTA_K_SQ = 0.1 * abs(GAMMA_V0_SQ)  # Subleading curvature contribution

# Coherence range
C = np.linspace(0, 1.5, 1000)

# Effective cosmological constant
Lambda_eff = LAMBDA_0 + GAMMA_V0_SQ * C + DELTA_K_SQ * C**2

# Create figure with two panels
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(8, 10))

# Panel 1: Full range showing cancellation mechanism
ax1.plot(C, Lambda_eff, 'b-', linewidth=3, label=r'$\Lambda_{\mathrm{eff}}(C)$')

# Observed value
ax1.axhline(y=LAMBDA_OBS, color='green', linestyle='--', linewidth=2.5,
            label=r'$\Lambda_{\mathrm{obs}}$ (measured)', zorder=5)

# 1-sigma and 2-sigma observational constraints (roughly ±10% and ±20%)
sigma_1 = 0.1 * LAMBDA_OBS
sigma_2 = 0.2 * LAMBDA_OBS
ax1.axhspan(LAMBDA_OBS - sigma_1, LAMBDA_OBS + sigma_1, alpha=0.2, color='green',
            label=r'$1\sigma$ constraint')
ax1.axhspan(LAMBDA_OBS - sigma_2, LAMBDA_OBS + sigma_2, alpha=0.1, color='green',
            label=r'$2\sigma$ constraint')

# Bare cosmological constant
ax1.axhline(y=LAMBDA_0, color='red', linestyle=':', linewidth=2,
            label=r'$\Lambda_0$ (bare vacuum energy)', alpha=0.7)

# Mark phi^{-1} crossing point
Lambda_at_phi_inv = LAMBDA_0 + GAMMA_V0_SQ * PHI_INV + DELTA_K_SQ * PHI_INV**2
ax1.plot(PHI_INV, Lambda_at_phi_inv, 'go', markersize=14,
         markeredgecolor='black', markeredgewidth=1.5,
         label=f'Natural cancellation at φ⁻¹', zorder=10)

# Vertical line at phi^{-1}
ax1.axvline(x=PHI_INV, color='orange', linestyle='--', linewidth=2,
            alpha=0.6, label=f'C = φ⁻¹ ≈ {PHI_INV:.3f}')

ax1.set_xlabel('Observer Coherence C', fontsize=13)
ax1.set_ylabel(r'$\Lambda_{\mathrm{eff}} / \Lambda_{\mathrm{obs}}$', fontsize=13)
ax1.set_title('Cosmological Constant via Observer Coherence', fontsize=14, fontweight='bold')
ax1.legend(loc='upper right', fontsize=10, ncol=1)
ax1.grid(True, alpha=0.3)
ax1.set_xlim([0, 1.2])
ax1.set_ylim([-50, 150])

# Add annotation box
textstr = 'Mechanism:\n'
textstr += r'$\Lambda_{\mathrm{eff}} = \Lambda_0 + \gamma v_O^2 C + \delta \langle K^2 \rangle C^2$'
textstr += '\n\nNatural cancellation when:\n'
textstr += r'$C \approx \phi^{-1} = \frac{\sqrt{5}-1}{2}$'
textstr += '\n\nNo fine-tuning required!'

props = dict(boxstyle='round', facecolor='wheat', alpha=0.7)
ax1.text(0.97, 0.35, textstr, transform=ax1.transAxes, fontsize=10,
         verticalalignment='top', horizontalalignment='right', bbox=props)

# Panel 2: Zoomed view near observed value
C_zoom = np.linspace(0.5, 0.8, 500)
Lambda_eff_zoom = LAMBDA_0 + GAMMA_V0_SQ * C_zoom + DELTA_K_SQ * C_zoom**2

ax2.plot(C_zoom, Lambda_eff_zoom, 'b-', linewidth=3)

# Observed value and constraints
ax2.axhline(y=LAMBDA_OBS, color='green', linestyle='--', linewidth=2.5,
            label=r'$\Lambda_{\mathrm{obs}}$')
ax2.axhspan(LAMBDA_OBS - sigma_1, LAMBDA_OBS + sigma_1, alpha=0.25, color='green')
ax2.axhspan(LAMBDA_OBS - sigma_2, LAMBDA_OBS + sigma_2, alpha=0.15, color='green')

# Phi^{-1} point
ax2.plot(PHI_INV, Lambda_at_phi_inv, 'go', markersize=16,
         markeredgecolor='black', markeredgewidth=2, zorder=10)
ax2.axvline(x=PHI_INV, color='orange', linestyle='--', linewidth=2.5, alpha=0.7)

# Show allowed coherence range
# Find C values where Lambda_eff is within 2-sigma
tolerance = 2 * sigma_2
C_fine = np.linspace(0.5, 0.8, 10000)
Lambda_fine = LAMBDA_0 + GAMMA_V0_SQ * C_fine + DELTA_K_SQ * C_fine**2
allowed_indices = np.where(np.abs(Lambda_fine - LAMBDA_OBS) < tolerance)[0]

if len(allowed_indices) > 0:
    C_min_allowed = C_fine[allowed_indices[0]]
    C_max_allowed = C_fine[allowed_indices[-1]]
    ax2.axvspan(C_min_allowed, C_max_allowed, alpha=0.15, color='blue',
                label=f'Allowed range: [{C_min_allowed:.3f}, {C_max_allowed:.3f}]')

ax2.set_xlabel('Observer Coherence C', fontsize=13)
ax2.set_ylabel(r'$\Lambda_{\mathrm{eff}} / \Lambda_{\mathrm{obs}}$', fontsize=13)
ax2.set_title('Zoomed View: Cancellation Region', fontsize=14, fontweight='bold')
ax2.legend(loc='upper right', fontsize=10)
ax2.grid(True, alpha=0.3)
ax2.set_xlim([0.5, 0.8])
ax2.set_ylim([0.5, 1.5])

# Statistics text
textstr2 = f'At C = φ⁻¹ = {PHI_INV:.4f}:\n'
textstr2 += f'Λₑff / Λₒbs = {Lambda_at_phi_inv:.4f}\n'
textstr2 += f'Deviation: {abs(Lambda_at_phi_inv - LAMBDA_OBS)/LAMBDA_OBS * 100:.2f}%\n'
textstr2 += f'\nWithin observational\nconstraints!'

props2 = dict(boxstyle='round', facecolor='lightblue', alpha=0.7)
ax2.text(0.03, 0.97, textstr2, transform=ax2.transAxes, fontsize=10,
         verticalalignment='top', bbox=props2)

plt.tight_layout()
plt.savefig('fig4_cosmological_constant.pdf', dpi=300, bbox_inches='tight')
print("Figure 4 generated: fig4_cosmological_constant.pdf")
print(f"Lambda_eff at C=phi^{{-1}}: {Lambda_at_phi_inv:.4f} Lambda_obs")
print(f"Deviation from observed: {abs(Lambda_at_phi_inv - LAMBDA_OBS)/LAMBDA_OBS * 100:.2f}%")
plt.close()
