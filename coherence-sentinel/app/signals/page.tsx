'use client';

import { useApp, useSelectedPatient, usePatientData } from '@/lib/context/app-context';
import { TrendChart } from '@/components/trend-chart';
import { MetricCard } from '@/components/metric-card';
import { getFullLabel } from '@/lib/myth-labels';
import * as Tabs from '@radix-ui/react-tabs';
import { cn } from '@/lib/utils';

export default function SignalsPage() {
  const { settings } = useApp();
  const patient = useSelectedPatient();
  const patientData = usePatientData(patient?.id || '');

  const pageLabel = getFullLabel('signals', settings.viewMode);

  if (!patient || !patientData.wearable || !patientData.lab || !patientData.derived) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a patient to view their signals.</p>
        </div>
      </div>
    );
  }

  const { wearable, lab, derived } = patientData;

  const latestHRV = wearable.hrv[wearable.hrv.length - 1]?.value || 0;
  const latestHR = wearable.restingHR[wearable.restingHR.length - 1]?.value || 0;
  const latestSleep = wearable.sleepScore[wearable.sleepScore.length - 1]?.value || 0;
  const latestGlucose = lab.glucose[lab.glucose.length - 1]?.value || 0;
  const latestLactate = lab.lactate[lab.lactate.length - 1]?.value || 0;
  const latestCRP = lab.crp?.[lab.crp.length - 1]?.value || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Patient: <span className="font-medium">{patient.name}</span>
        </p>
      </div>

      {/* Tabs */}
      <Tabs.Root defaultValue="wearables" className="w-full">
        <Tabs.List className="flex gap-2 border-b border-gray-200">
          <Tabs.Trigger
            value="wearables"
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              'data-[state=active]:border-green-600 data-[state=active]:text-green-600',
              'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600',
              'hover:text-gray-900'
            )}
          >
            Wearables
          </Tabs.Trigger>
          <Tabs.Trigger
            value="labs"
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              'data-[state=active]:border-green-600 data-[state=active]:text-green-600',
              'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600',
              'hover:text-gray-900'
            )}
          >
            Labs
          </Tabs.Trigger>
          <Tabs.Trigger
            value="derived"
            className={cn(
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              'data-[state=active]:border-green-600 data-[state=active]:text-green-600',
              'data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-600',
              'hover:text-gray-900'
            )}
          >
            Derived Metrics
          </Tabs.Trigger>
        </Tabs.List>

        {/* Wearables Tab */}
        <Tabs.Content value="wearables" className="mt-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label={getFullLabel('hrv', settings.viewMode).label}
              subtitle={getFullLabel('hrv', settings.viewMode).subtitle}
              value={latestHRV.toFixed(0)}
              unit="ms"
              variant={latestHRV > 60 ? 'success' : latestHRV > 45 ? 'warning' : 'danger'}
            />
            <MetricCard
              label="Resting Heart Rate"
              value={latestHR.toFixed(0)}
              unit="bpm"
              variant={latestHR < 65 ? 'success' : latestHR < 75 ? 'warning' : 'danger'}
            />
            <MetricCard
              label="Sleep Score"
              value={latestSleep.toFixed(0)}
              unit="/100"
              variant={latestSleep > 70 ? 'success' : latestSleep > 50 ? 'warning' : 'danger'}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">HRV Over Time</h3>
              <TrendChart
                data={wearable.hrv}
                label="HRV (ms)"
                color="hsl(142, 76%, 36%)"
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Resting Heart Rate</h3>
              <TrendChart
                data={wearable.restingHR}
                label="HR (bpm)"
                color="hsl(0, 84%, 60%)"
              />
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">Sleep Score</h3>
            <TrendChart
              data={wearable.sleepScore}
              label="Sleep Quality"
              color="hsl(240, 76%, 56%)"
              showArea
            />
          </div>
        </Tabs.Content>

        {/* Labs Tab */}
        <Tabs.Content value="labs" className="mt-6 space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              label={getFullLabel('glucose', settings.viewMode).label}
              subtitle={getFullLabel('glucose', settings.viewMode).subtitle}
              value={latestGlucose.toFixed(0)}
              unit="mg/dL"
              variant={latestGlucose < 100 ? 'success' : latestGlucose < 110 ? 'warning' : 'danger'}
            />
            <MetricCard
              label={getFullLabel('lactate', settings.viewMode).label}
              subtitle={getFullLabel('lactate', settings.viewMode).subtitle}
              value={latestLactate.toFixed(1)}
              unit="mmol/L"
              variant={latestLactate < 1.5 ? 'success' : latestLactate < 2.0 ? 'warning' : 'danger'}
            />
            <MetricCard
              label="C-Reactive Protein"
              value={latestCRP.toFixed(1)}
              unit="mg/L"
              variant={latestCRP < 3 ? 'success' : latestCRP < 10 ? 'warning' : 'danger'}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Glucose Levels</h3>
              <TrendChart
                data={lab.glucose}
                label="Glucose (mg/dL)"
                color="hsl(24, 95%, 53%)"
                showArea
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Lactate Levels</h3>
              <TrendChart
                data={lab.lactate}
                label="Lactate (mmol/L)"
                color="hsl(280, 60%, 50%)"
              />
            </div>
          </div>

          {lab.crp && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">CRP (Inflammation Marker)</h3>
              <TrendChart
                data={lab.crp}
                label="CRP (mg/L)"
                color="hsl(0, 70%, 50%)"
              />
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> Lab values shown are demo data. In production, integrate with actual lab systems and EHR.
            </p>
          </div>
        </Tabs.Content>

        {/* Derived Metrics Tab */}
        <Tabs.Content value="derived" className="mt-6 space-y-6">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold mb-4">
              {getFullLabel('phiProximity', settings.viewMode).label}
            </h3>
            <TrendChart
              data={derived.phiProximity}
              label="φ-Proximity"
              color="hsl(200, 80%, 50%)"
              showArea
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Wobble Amplitude</h3>
              <TrendChart
                data={derived.wobbleAmplitude}
                label="Wobble"
                color="hsl(173, 58%, 39%)"
              />
            </div>
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">Phase Shift Probability</h3>
              <TrendChart
                data={derived.phaseShiftProbability}
                label="Phase Shift"
                color="hsl(280, 60%, 50%)"
              />
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-900">
              <strong>Note:</strong> Derived metrics use placeholder formulas. See Coherence Engine page for TODO items on production algorithms.
            </p>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
}
