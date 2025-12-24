// Core types for Coherence Sentinel

export interface Patient {
  id: string;
  name: string;
  age: number;
  sex: 'M' | 'F' | 'Other';
  riskLevel: 'low' | 'medium' | 'high';
  enrollmentDate: Date;
  lastVisit: Date;
  notes?: string;
}

export interface TimeSeriesPoint {
  timestamp: Date;
  value: number;
}

export interface WearableData {
  patientId: string;
  hrv: TimeSeriesPoint[]; // Heart rate variability (ms)
  restingHR: TimeSeriesPoint[]; // Resting heart rate (bpm)
  sleepScore: TimeSeriesPoint[]; // Sleep quality score (0-100)
}

export interface LabData {
  patientId: string;
  glucose: TimeSeriesPoint[]; // mg/dL
  lactate: TimeSeriesPoint[]; // mmol/L
  crp?: TimeSeriesPoint[]; // C-reactive protein (mg/L)
}

export interface DerivedMetrics {
  patientId: string;
  phiProximity: TimeSeriesPoint[]; // φ-proximity (0-1)
  wobbleAmplitude: TimeSeriesPoint[]; // Wobble amplitude
  tauCollapseFlag: TimeSeriesPoint[]; // τ-collapse threshold (boolean as 0/1)
  phaseShiftProbability: TimeSeriesPoint[]; // Phase shift probability (0-1)
  coherenceIndex: TimeSeriesPoint[]; // Overall coherence (0-100)
  metabolicDrift: TimeSeriesPoint[]; // Lactate:glucose ratio
  autonomicStability: TimeSeriesPoint[]; // Derived from HRV
  rankCollapseRisk: TimeSeriesPoint[]; // Representation monoculture proxy (0-1)
  wobbleBudget: TimeSeriesPoint[]; // Protected exploration % (0-100)
}

export interface Alert {
  id: string;
  patientId: string;
  type: 'phi-proximity-drop' | 'metabolic-drift' | 'hrv-collapse' | 'rank-collapse' | 'wobble-depletion';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  timestamp: Date;
  confidence: number; // 0-1
  suggestedProtocols: string[];
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface ProtocolModule {
  id: string;
  name: string;
  category: 'autonomic' | 'metabolic' | 'behavioral' | 'experimental';
  description: string;
  indications: string[];
  contraindications: string[];
  steps: string[];
  monitoringPlan: string[];
  isExperimental: boolean;
}

export interface PatientPlan {
  patientId: string;
  protocols: string[]; // Protocol IDs
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export type ViewMode = 'clinical' | 'myth';

export interface AppSettings {
  viewMode: ViewMode;
  reducedMotion: boolean;
  theme: 'light' | 'dark';
  dataSource: 'demo' | 'uploaded';
}

export interface MythLabels {
  clinical: string;
  myth: string;
  subtitle?: string;
}
