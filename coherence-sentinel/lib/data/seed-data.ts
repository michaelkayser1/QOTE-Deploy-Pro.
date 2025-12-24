import {
  Patient,
  WearableData,
  LabData,
  DerivedMetrics,
  Alert,
  ProtocolModule,
  TimeSeriesPoint
} from '../types';

// Helper to generate time series data with realistic patterns
function generateTimeSeries(
  days: number,
  baseValue: number,
  variance: number,
  trend: 'stable' | 'increasing' | 'decreasing' | 'cyclic' = 'stable',
  noise: number = 0.1
): TimeSeriesPoint[] {
  const data: TimeSeriesPoint[] = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const timestamp = new Date(now);
    timestamp.setDate(timestamp.getDate() - i);

    let value = baseValue;

    // Apply trend
    switch (trend) {
      case 'increasing':
        value += (days - i) * variance / days;
        break;
      case 'decreasing':
        value -= (days - i) * variance / days;
        break;
      case 'cyclic':
        value += Math.sin((days - i) / 7 * Math.PI) * variance;
        break;
    }

    // Add random noise
    value += (Math.random() - 0.5) * 2 * variance * noise;

    data.push({ timestamp, value });
  }

  return data;
}

// Generate 6 demo patients
export const DEMO_PATIENTS: Patient[] = [
  {
    id: 'p1',
    name: 'Alex Chen',
    age: 34,
    sex: 'M',
    riskLevel: 'low',
    enrollmentDate: new Date('2024-09-01'),
    lastVisit: new Date('2024-12-20'),
    notes: 'High coherence baseline, stable autonomic function'
  },
  {
    id: 'p2',
    name: 'Morgan Rivera',
    age: 42,
    sex: 'F',
    riskLevel: 'medium',
    enrollmentDate: new Date('2024-08-15'),
    lastVisit: new Date('2024-12-18'),
    notes: 'Metabolic drift trending up, monitoring glucose patterns'
  },
  {
    id: 'p3',
    name: 'Jordan Kim',
    age: 28,
    sex: 'Other',
    riskLevel: 'low',
    enrollmentDate: new Date('2024-10-01'),
    lastVisit: new Date('2024-12-22'),
    notes: 'Recently enrolled, establishing baseline'
  },
  {
    id: 'p4',
    name: 'Taylor Brooks',
    age: 51,
    sex: 'F',
    riskLevel: 'high',
    enrollmentDate: new Date('2024-07-01'),
    lastVisit: new Date('2024-12-19'),
    notes: 'High rank-collapse risk, wobble budget depleted, needs protocol adjustment'
  },
  {
    id: 'p5',
    name: 'Casey Martinez',
    age: 37,
    sex: 'M',
    riskLevel: 'medium',
    enrollmentDate: new Date('2024-09-15'),
    lastVisit: new Date('2024-12-21'),
    notes: 'HRV variability increased, phase shift probability elevated'
  },
  {
    id: 'p6',
    name: 'Avery Singh',
    age: 45,
    sex: 'F',
    riskLevel: 'low',
    enrollmentDate: new Date('2024-08-01'),
    lastVisit: new Date('2024-12-23'),
    notes: 'Strong φ-proximity, good wobble utilization'
  }
];

// Generate wearable data for all patients
export function generateWearableData(): WearableData[] {
  return DEMO_PATIENTS.map(patient => ({
    patientId: patient.id,
    hrv: generateTimeSeries(90, 65, 20, patient.riskLevel === 'high' ? 'decreasing' : 'stable', 0.15),
    restingHR: generateTimeSeries(90, 62, 10, patient.riskLevel === 'high' ? 'increasing' : 'stable', 0.1),
    sleepScore: generateTimeSeries(90, 75, 15, 'cyclic', 0.2)
  }));
}

// Generate lab data for all patients
export function generateLabData(): LabData[] {
  return DEMO_PATIENTS.map(patient => ({
    patientId: patient.id,
    glucose: generateTimeSeries(90, 95, 15, patient.riskLevel === 'high' ? 'increasing' : 'stable', 0.12),
    lactate: generateTimeSeries(90, 1.2, 0.4, patient.riskLevel === 'medium' || patient.riskLevel === 'high' ? 'increasing' : 'stable', 0.15),
    crp: generateTimeSeries(90, 1.5, 1.0, 'stable', 0.2)
  }));
}

// Generate derived metrics
export function generateDerivedMetrics(): DerivedMetrics[] {
  return DEMO_PATIENTS.map(patient => {
    const baseCoherence = patient.riskLevel === 'low' ? 80 : patient.riskLevel === 'medium' ? 60 : 40;
    const basePhi = patient.riskLevel === 'low' ? 0.75 : patient.riskLevel === 'medium' ? 0.55 : 0.35;

    return {
      patientId: patient.id,
      phiProximity: generateTimeSeries(90, basePhi, 0.15, patient.riskLevel === 'high' ? 'decreasing' : 'stable', 0.1),
      wobbleAmplitude: generateTimeSeries(90, 0.5, 0.2, 'cyclic', 0.15),
      tauCollapseFlag: generateTimeSeries(90, patient.riskLevel === 'high' ? 0.7 : 0.1, 0.3, 'stable', 0.2).map(p => ({ ...p, value: p.value > 0.5 ? 1 : 0 })),
      phaseShiftProbability: generateTimeSeries(90, 0.3, 0.2, 'cyclic', 0.15),
      coherenceIndex: generateTimeSeries(90, baseCoherence, 15, patient.riskLevel === 'high' ? 'decreasing' : 'stable', 0.1),
      metabolicDrift: generateTimeSeries(90, 0.0126, 0.005, patient.riskLevel === 'high' ? 'increasing' : 'stable', 0.15), // lactate/glucose ratio
      autonomicStability: generateTimeSeries(90, baseCoherence - 10, 12, patient.riskLevel === 'high' ? 'decreasing' : 'stable', 0.12),
      rankCollapseRisk: generateTimeSeries(90, patient.riskLevel === 'high' ? 0.65 : 0.25, 0.15, patient.riskLevel === 'high' ? 'increasing' : 'stable', 0.1),
      wobbleBudget: generateTimeSeries(90, patient.riskLevel === 'high' ? 25 : 65, 15, patient.riskLevel === 'high' ? 'decreasing' : 'stable', 0.12)
    };
  });
}

// Generate demo alerts
export function generateAlerts(): Alert[] {
  return [
    {
      id: 'a1',
      patientId: 'p4',
      type: 'phi-proximity-drop',
      severity: 'high',
      title: 'Significant φ-Proximity Drop Detected',
      description: 'φ-proximity decreased by 28% over the past 7 days, indicating loss of coherence alignment.',
      timestamp: new Date('2024-12-22T09:15:00'),
      confidence: 0.87,
      suggestedProtocols: ['autonomic-coherence', 'wobble-budget-increase'],
      acknowledged: false
    },
    {
      id: 'a2',
      patientId: 'p4',
      type: 'rank-collapse',
      severity: 'high',
      title: 'Rank Collapse Risk Elevated',
      description: 'System rigidity indicators suggest reduced adaptive capacity. Representation monoculture detected.',
      timestamp: new Date('2024-12-21T14:30:00'),
      confidence: 0.92,
      suggestedProtocols: ['wobble-budget-increase', 'beta-nudge'],
      acknowledged: true
    },
    {
      id: 'a3',
      patientId: 'p2',
      type: 'metabolic-drift',
      severity: 'medium',
      title: 'Metabolic Drift Above Threshold',
      description: 'Lactate:glucose ratio trending upward. Monitor for metabolic stress patterns.',
      timestamp: new Date('2024-12-20T11:00:00'),
      confidence: 0.78,
      suggestedProtocols: ['metabolic-stabilization'],
      acknowledged: true,
      resolvedAt: new Date('2024-12-22T10:00:00')
    },
    {
      id: 'a4',
      patientId: 'p5',
      type: 'hrv-collapse',
      severity: 'medium',
      title: 'HRV Variability Spike',
      description: 'Autonomic function showing increased variability. Phase shift probability elevated.',
      timestamp: new Date('2024-12-19T08:45:00'),
      confidence: 0.71,
      suggestedProtocols: ['autonomic-coherence'],
      acknowledged: true
    },
    {
      id: 'a5',
      patientId: 'p4',
      type: 'wobble-depletion',
      severity: 'high',
      title: 'Wobble Budget Critically Low',
      description: 'Protected exploration capacity below 30%. System may be over-constrained.',
      timestamp: new Date('2024-12-18T16:20:00'),
      confidence: 0.89,
      suggestedProtocols: ['wobble-budget-increase'],
      acknowledged: true
    },
    {
      id: 'a6',
      patientId: 'p2',
      type: 'phi-proximity-drop',
      severity: 'medium',
      title: 'φ-Proximity Declining',
      description: 'Gradual decrease in coherence alignment over 14 days.',
      timestamp: new Date('2024-12-17T13:10:00'),
      confidence: 0.65,
      suggestedProtocols: ['autonomic-coherence'],
      acknowledged: true
    },
    {
      id: 'a7',
      patientId: 'p1',
      type: 'metabolic-drift',
      severity: 'low',
      title: 'Minor Metabolic Shift',
      description: 'Small uptick in metabolic drift, within normal bounds but worth monitoring.',
      timestamp: new Date('2024-12-16T10:30:00'),
      confidence: 0.58,
      suggestedProtocols: [],
      acknowledged: true,
      resolvedAt: new Date('2024-12-18T09:00:00')
    },
    {
      id: 'a8',
      patientId: 'p5',
      type: 'rank-collapse',
      severity: 'medium',
      title: 'Elevated Rank Collapse Risk',
      description: 'Behavioral patterns suggest reduced exploration. Consider wobble interventions.',
      timestamp: new Date('2024-12-15T15:45:00'),
      confidence: 0.73,
      suggestedProtocols: ['wobble-budget-increase', 'beta-nudge'],
      acknowledged: true
    },
    {
      id: 'a9',
      patientId: 'p3',
      type: 'hrv-collapse',
      severity: 'low',
      title: 'HRV Baseline Establishment',
      description: 'Initial autonomic patterns recorded. No immediate concerns.',
      timestamp: new Date('2024-12-14T09:00:00'),
      confidence: 0.62,
      suggestedProtocols: [],
      acknowledged: true,
      resolvedAt: new Date('2024-12-16T10:00:00')
    },
    {
      id: 'a10',
      patientId: 'p6',
      type: 'phi-proximity-drop',
      severity: 'low',
      title: 'Transient φ-Proximity Dip',
      description: 'Brief coherence fluctuation, likely related to acute stress event. Self-resolved.',
      timestamp: new Date('2024-12-13T11:20:00'),
      confidence: 0.55,
      suggestedProtocols: [],
      acknowledged: true,
      resolvedAt: new Date('2024-12-14T08:00:00')
    }
  ];
}

// Protocol modules library
export const PROTOCOL_MODULES: ProtocolModule[] = [
  {
    id: 'autonomic-coherence',
    name: 'Autonomic Coherence Practice',
    category: 'autonomic',
    description: 'HRV biofeedback protocol to enhance autonomic nervous system coherence and stability.',
    indications: [
      'HRV collapse or high variability',
      'Autonomic instability',
      'φ-proximity decline related to stress dysregulation'
    ],
    contraindications: [
      'Acute cardiovascular events (within 6 weeks)',
      'Uncontrolled arrhythmias'
    ],
    steps: [
      'Establish baseline HRV using 5-minute recording',
      'Guided breathing practice (5-6 breaths/min) with biofeedback',
      'Real-time coherence visualization',
      'Daily practice: 10-15 minutes, 2x/day',
      'Weekly progress review'
    ],
    monitoringPlan: [
      'Track daily HRV trends',
      'Monitor autonomic stability scores',
      'Assess φ-proximity changes weekly',
      'Review coherence index monthly'
    ],
    isExperimental: false
  },
  {
    id: 'wobble-budget-increase',
    name: 'Wobble Budget Expansion',
    category: 'behavioral',
    description: 'Structured protocol to increase protected exploration capacity and reduce system rigidity.',
    indications: [
      'Wobble budget < 40%',
      'Rank collapse risk elevated',
      'Behavioral rigidity patterns'
    ],
    contraindications: [
      'Acute crisis or instability',
      'Insufficient support structures'
    ],
    steps: [
      'Map current constraint landscape',
      'Identify 3 low-risk exploration zones',
      'Establish safety parameters and monitoring',
      'Implement gradual exposure protocol',
      'Track wobble amplitude and budget weekly',
      'Adjust based on tolerance and outcomes'
    ],
    monitoringPlan: [
      'Weekly wobble budget assessment',
      'Rank collapse risk tracking',
      'Phase shift probability monitoring',
      'Subjective tolerance ratings'
    ],
    isExperimental: false
  },
  {
    id: 'beta-nudge',
    name: 'β-Nudge Protocol',
    category: 'experimental',
    description: 'Experimental intervention protocol. Gentle perturbation to shift local energy landscape. Demo template only.',
    indications: [
      'System "stuck" in suboptimal attractor',
      'High rank collapse with low wobble budget',
      'Persistent low φ-proximity despite other interventions'
    ],
    contraindications: [
      'Active instability or crisis',
      'Insufficient monitoring capacity',
      'Not suitable for uncontrolled settings'
    ],
    steps: [
      '[EXPERIMENTAL - TEMPLATE ONLY]',
      'Detailed risk-benefit analysis required',
      'Establish robust monitoring framework',
      'Define perturbation parameters (dose, timing, context)',
      'Implement with close supervision',
      'Monitor for adverse responses',
      'Document all outcomes'
    ],
    monitoringPlan: [
      'Continuous coherence index tracking',
      'Real-time φ-proximity monitoring',
      'Autonomic stability assessment',
      'Adverse event surveillance',
      'Weekly comprehensive review'
    ],
    isExperimental: true
  },
  {
    id: 'metabolic-stabilization',
    name: 'Metabolic Stabilization Protocol',
    category: 'metabolic',
    description: 'Protocol to address metabolic drift and optimize glucose-lactate dynamics.',
    indications: [
      'Metabolic drift > threshold',
      'Glucose dysregulation',
      'Lactate elevation patterns'
    ],
    contraindications: [
      'Diagnosed metabolic disorders requiring specialist care',
      'Medication interactions (requires MD clearance)'
    ],
    steps: [
      'Comprehensive metabolic baseline assessment',
      'Continuous glucose monitoring (if indicated)',
      'Dietary pattern analysis and optimization',
      'Exercise timing and intensity calibration',
      'Sleep hygiene optimization',
      'Bi-weekly metabolic panel review'
    ],
    monitoringPlan: [
      'Daily glucose tracking (if CGM available)',
      'Weekly lactate trends',
      'Metabolic drift calculation',
      'Coherence index correlation analysis'
    ],
    isExperimental: false
  }
];
