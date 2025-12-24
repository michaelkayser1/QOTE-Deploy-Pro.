import { MythLabels } from './types';

/**
 * Myth Layer Labels
 *
 * Mapping between clinical terminology and mythic/poetic interpretations.
 * The myth layer changes labels and adds subtitles but never changes data.
 */

export const MYTH_LABELS: Record<string, MythLabels> = {
  // Main navigation
  overview: {
    clinical: 'Overview',
    myth: 'Observatory',
    subtitle: 'View from the Rim'
  },
  patients: {
    clinical: 'Patients',
    myth: 'Guardians',
    subtitle: 'Those Who Wobble'
  },
  signals: {
    clinical: 'Signals',
    myth: 'Emanations',
    subtitle: 'What the Body Speaks'
  },
  coherenceEngine: {
    clinical: 'Coherence Engine',
    myth: 'Subspace Mechanics',
    subtitle: 'The Mathematics of Becoming'
  },
  alerts: {
    clinical: 'Alerts',
    myth: 'Rim Warnings',
    subtitle: 'Boundary Conditions'
  },
  protocols: {
    clinical: 'Protocols',
    myth: 'Ritual Modules',
    subtitle: 'Deliberate Perturbations'
  },
  reports: {
    clinical: 'Reports',
    myth: 'Field Notes',
    subtitle: 'Documentation of Passage'
  },

  // Key metrics
  coherenceIndex: {
    clinical: 'Coherence Index',
    myth: 'Guardian Clarity',
    subtitle: 'How well the center holds'
  },
  phiProximity: {
    clinical: 'φ-Proximity',
    myth: 'Golden Alignment',
    subtitle: 'Distance to the harmonic'
  },
  metabolicDrift: {
    clinical: 'Metabolic Drift',
    myth: 'Energy Flux',
    subtitle: 'The substrate speaks'
  },
  autonomicStability: {
    clinical: 'Autonomic Stability',
    myth: 'Breath Coherence',
    subtitle: 'The rhythm that sustains'
  },
  rankCollapseRisk: {
    clinical: 'Rank Collapse Risk',
    myth: 'Crystallization Warning',
    subtitle: 'When the system freezes'
  },
  wobbleBudget: {
    clinical: 'Wobble Budget',
    myth: 'Sacred Play Capacity',
    subtitle: 'Room to explore without breaking'
  },

  // Actions
  nextBestActions: {
    clinical: 'Next Best Actions',
    myth: 'Deliberate Wobble Moves',
    subtitle: 'How to shift the landscape'
  },
  generateReport: {
    clinical: 'Generate Report',
    myth: 'Summon Chronicle',
    subtitle: 'Bind the observations'
  },
  addProtocol: {
    clinical: 'Add to Patient Plan',
    myth: 'Weave into Pattern',
    subtitle: 'Integrate the intervention'
  },

  // Alert types
  phiProximityDrop: {
    clinical: 'φ-Proximity Drop',
    myth: 'Harmonic Drift',
    subtitle: 'Losing the golden thread'
  },
  metabolicDriftAlert: {
    clinical: 'Metabolic Drift',
    myth: 'Substrate Storm',
    subtitle: 'The fuel runs strange'
  },
  hrvCollapse: {
    clinical: 'HRV Collapse',
    myth: 'Breath Disruption',
    subtitle: 'The rhythm falters'
  },
  rankCollapseAlert: {
    clinical: 'Rank Collapse',
    myth: 'Crystallization Event',
    subtitle: 'The system ossifies'
  },
  wobbleDepletion: {
    clinical: 'Wobble Budget Depletion',
    myth: 'Play Exhaustion',
    subtitle: 'No room left to move'
  },

  // Risk levels
  riskLow: {
    clinical: 'Low Risk',
    myth: 'Stable Orbit',
    subtitle: 'Safe in the pattern'
  },
  riskMedium: {
    clinical: 'Medium Risk',
    myth: 'Wobbling',
    subtitle: 'At the edge of order'
  },
  riskHigh: {
    clinical: 'High Risk',
    myth: 'Near the Rim',
    subtitle: 'Boundary conditions active'
  },

  // Lab values
  glucose: {
    clinical: 'Glucose',
    myth: 'Sweet Fire',
    subtitle: 'Primary fuel'
  },
  lactate: {
    clinical: 'Lactate',
    myth: 'Effort Echo',
    subtitle: 'What exertion leaves behind'
  },
  hrv: {
    clinical: 'Heart Rate Variability',
    myth: 'Pulse Weave',
    subtitle: 'The heart\'s dance'
  },

  // Protocol categories
  autonomicProtocol: {
    clinical: 'Autonomic Protocol',
    myth: 'Breath Ritual',
    subtitle: 'Restore the rhythm'
  },
  metabolicProtocol: {
    clinical: 'Metabolic Protocol',
    myth: 'Substrate Alchemy',
    subtitle: 'Balance the elements'
  },
  behavioralProtocol: {
    clinical: 'Behavioral Protocol',
    myth: 'Pattern Weaving',
    subtitle: 'Reshape the habitus'
  },
  experimentalProtocol: {
    clinical: 'Experimental Protocol',
    myth: 'Edge Working',
    subtitle: 'Intentional perturbation'
  },

  // Disclaimer
  disclaimer: {
    clinical: 'Demo / research prototype. Not medical advice.',
    myth: 'These are maps, not the territory. Navigate with care.',
    subtitle: 'The models point; the lived experience speaks'
  }
};

/**
 * Get label based on current view mode
 */
export function getLabel(key: string, mode: 'clinical' | 'myth'): string {
  const labels = MYTH_LABELS[key];
  return labels ? labels[mode] : key;
}

/**
 * Get full label with subtitle (for myth mode)
 */
export function getFullLabel(key: string, mode: 'clinical' | 'myth'): {
  label: string;
  subtitle?: string;
} {
  const labels = MYTH_LABELS[key];
  if (!labels) return { label: key };

  return {
    label: labels[mode],
    subtitle: mode === 'myth' ? labels.subtitle : undefined
  };
}
