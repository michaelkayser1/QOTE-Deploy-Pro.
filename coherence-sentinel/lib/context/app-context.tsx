'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { ViewMode, AppSettings } from '../types';
import {
  DEMO_PATIENTS,
  generateWearableData,
  generateLabData,
  generateDerivedMetrics,
  generateAlerts,
  PROTOCOL_MODULES
} from '../data/seed-data';

interface AppContextValue {
  // Settings
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;

  // Selected patient
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;

  // Date range
  dateRange: { start: Date; end: Date };
  setDateRange: (range: { start: Date; end: Date }) => void;

  // Data access
  patients: typeof DEMO_PATIENTS;
  wearableData: ReturnType<typeof generateWearableData>;
  labData: ReturnType<typeof generateLabData>;
  derivedMetrics: ReturnType<typeof generateDerivedMetrics>;
  alerts: ReturnType<typeof generateAlerts>;
  protocolModules: typeof PROTOCOL_MODULES;
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  viewMode: 'clinical',
  reducedMotion: false,
  theme: 'light',
  dataSource: 'demo'
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>('p1');

  // Default to last 30 days
  const defaultEnd = new Date();
  const defaultStart = new Date();
  defaultStart.setDate(defaultStart.getDate() - 30);

  const [dateRange, setDateRange] = useState({ start: defaultStart, end: defaultEnd });

  // Generate all seed data once
  const [patients] = useState(DEMO_PATIENTS);
  const [wearableData] = useState(generateWearableData());
  const [labData] = useState(generateLabData());
  const [derivedMetrics] = useState(generateDerivedMetrics());
  const [alerts] = useState(generateAlerts());
  const [protocolModules] = useState(PROTOCOL_MODULES);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...partial }));
  }, []);

  const value: AppContextValue = {
    settings,
    updateSettings,
    selectedPatientId,
    setSelectedPatientId,
    dateRange,
    setDateRange,
    patients,
    wearableData,
    labData,
    derivedMetrics,
    alerts,
    protocolModules
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

// Helper hooks for common queries
export function useSelectedPatient() {
  const { selectedPatientId, patients } = useApp();
  return patients.find(p => p.id === selectedPatientId) || null;
}

export function usePatientData(patientId: string) {
  const { wearableData, labData, derivedMetrics, alerts } = useApp();

  return {
    wearable: wearableData.find(w => w.patientId === patientId),
    lab: labData.find(l => l.patientId === patientId),
    derived: derivedMetrics.find(d => d.patientId === patientId),
    alerts: alerts.filter(a => a.patientId === patientId)
  };
}

export function usePatientAlerts(patientId: string) {
  const { alerts } = useApp();
  return alerts.filter(a => a.patientId === patientId);
}
