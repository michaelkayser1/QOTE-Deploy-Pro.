'use client';

import { useApp, useSelectedPatient, usePatientData } from '@/lib/context/app-context';
import { MetricCard } from '@/components/metric-card';
import { TrendChart } from '@/components/trend-chart';
import { getFullLabel } from '@/lib/myth-labels';
import { formatNumber } from '@/lib/utils';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

export default function OverviewPage() {
  const { settings } = useApp();
  const patient = useSelectedPatient();
  const patientData = usePatientData(patient?.id || '');

  if (!patient || !patientData.derived) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a patient to view their overview.</p>
        </div>
      </div>
    );
  }

  const { derived, wearable } = patientData;

  // Get latest values (last data point)
  const latestCoherence = derived.coherenceIndex[derived.coherenceIndex.length - 1]?.value || 0;
  const latestPhi = derived.phiProximity[derived.phiProximity.length - 1]?.value || 0;
  const latestMetabolicDrift = derived.metabolicDrift[derived.metabolicDrift.length - 1]?.value || 0;
  const latestAutonomic = derived.autonomicStability[derived.autonomicStability.length - 1]?.value || 0;
  const latestRankCollapse = derived.rankCollapseRisk[derived.rankCollapseRisk.length - 1]?.value || 0;
  const latestWobble = derived.wobbleBudget[derived.wobbleBudget.length - 1]?.value || 0;

  // Calculate trends (compare last 7 days to previous 7 days)
  const calculateTrend = (data: any[]) => {
    if (data.length < 14) return 'stable';
    const recent = data.slice(-7).reduce((sum, p) => sum + p.value, 0) / 7;
    const previous = data.slice(-14, -7).reduce((sum, p) => sum + p.value, 0) / 7;
    if (recent > previous * 1.05) return 'up';
    if (recent < previous * 0.95) return 'down';
    return 'stable';
  };

  // Determine variant based on value
  const getCoherenceVariant = (val: number) => val > 70 ? 'success' : val > 40 ? 'warning' : 'danger';
  const getPhiVariant = (val: number) => val > 0.7 ? 'success' : val > 0.4 ? 'warning' : 'danger';
  const getRiskVariant = (val: number) => val < 0.3 ? 'success' : val < 0.6 ? 'warning' : 'danger';

  const coherenceLabel = getFullLabel('coherenceIndex', settings.viewMode);
  const phiLabel = getFullLabel('phiProximity', settings.viewMode);
  const metabolicLabel = getFullLabel('metabolicDrift', settings.viewMode);
  const autonomicLabel = getFullLabel('autonomicStability', settings.viewMode);
  const rankLabel = getFullLabel('rankCollapseRisk', settings.viewMode);
  const wobbleLabel = getFullLabel('wobbleBudget', settings.viewMode);
  const actionsLabel = getFullLabel('nextBestActions', settings.viewMode);

  // Generate next best actions based on current state
  const nextActions = [];
  if (latestWobble < 40) {
    nextActions.push('Consider increasing wobble budget to restore exploration capacity');
  }
  if (latestPhi < 0.5) {
    nextActions.push('Review φ-proximity trends and autonomic coherence practices');
  }
  if (latestRankCollapse > 0.6) {
    nextActions.push('High rank collapse risk detected - implement behavioral diversification protocol');
  }
  if (latestMetabolicDrift > 0.015) {
    nextActions.push('Metabolic drift elevated - review glucose/lactate patterns and consider metabolic stabilization');
  }
  if (latestAutonomic < 60) {
    nextActions.push('Autonomic stability below target - initiate HRV biofeedback protocol');
  }
  if (nextActions.length === 0) {
    nextActions.push('Maintain current protocols and monitoring schedule');
    nextActions.push('Review weekly trends for early warning signs');
    nextActions.push('Continue supporting positive wobble utilization');
  }

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          {settings.viewMode === 'clinical' ? 'Overview' : getFullLabel('overview', settings.viewMode).label}
        </h1>
        {settings.viewMode === 'myth' && getFullLabel('overview', settings.viewMode).subtitle && (
          <p className="text-sm text-gray-600 italic mt-1">
            {getFullLabel('overview', settings.viewMode).subtitle}
          </p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Patient: <span className="font-medium">{patient.name}</span> (ID: {patient.id})
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <MetricCard
          label={coherenceLabel.label}
          subtitle={coherenceLabel.subtitle}
          value={formatNumber(latestCoherence, 0)}
          unit="/100"
          trend={calculateTrend(derived.coherenceIndex)}
          variant={getCoherenceVariant(latestCoherence)}
        />

        <MetricCard
          label={phiLabel.label}
          subtitle={phiLabel.subtitle}
          value={formatNumber(latestPhi, 2)}
          trend={calculateTrend(derived.phiProximity)}
          variant={getPhiVariant(latestPhi)}
        />

        <MetricCard
          label={metabolicLabel.label}
          subtitle={metabolicLabel.subtitle}
          value={formatNumber(latestMetabolicDrift, 4)}
          trend={calculateTrend(derived.metabolicDrift)}
          variant={latestMetabolicDrift < 0.012 ? 'success' : latestMetabolicDrift < 0.015 ? 'warning' : 'danger'}
        />

        <MetricCard
          label={autonomicLabel.label}
          subtitle={autonomicLabel.subtitle}
          value={formatNumber(latestAutonomic, 0)}
          unit="/100"
          trend={calculateTrend(derived.autonomicStability)}
          variant={getCoherenceVariant(latestAutonomic)}
        />

        <MetricCard
          label={rankLabel.label}
          subtitle={rankLabel.subtitle}
          value={formatNumber(latestRankCollapse, 2)}
          trend={calculateTrend(derived.rankCollapseRisk)}
          variant={getRiskVariant(latestRankCollapse)}
        />

        <MetricCard
          label={wobbleLabel.label}
          subtitle={wobbleLabel.subtitle}
          value={formatNumber(latestWobble, 0)}
          unit="%"
          trend={calculateTrend(derived.wobbleBudget)}
          variant={latestWobble > 60 ? 'success' : latestWobble > 40 ? 'warning' : 'danger'}
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {coherenceLabel.label} Over Time
          </h3>
          <TrendChart
            data={derived.coherenceIndex}
            label={coherenceLabel.label}
            color="hsl(142, 76%, 36%)"
            showArea
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {phiLabel.label} Over Time
          </h3>
          <TrendChart
            data={derived.phiProximity}
            label={phiLabel.label}
            color="hsl(200, 80%, 50%)"
            showArea
          />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {metabolicLabel.label} Over Time
          </h3>
          <TrendChart
            data={derived.metabolicDrift}
            label={metabolicLabel.label}
            color="hsl(24, 95%, 53%)"
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">
            {autonomicLabel.label} Over Time
          </h3>
          <TrendChart
            data={derived.autonomicStability}
            label={autonomicLabel.label}
            color="hsl(173, 58%, 39%)"
            showArea
          />
        </div>
      </div>

      {/* Next Best Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <ArrowRight className="h-5 w-5 text-green-600" />
          {actionsLabel.label}
        </h3>
        {actionsLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mb-4">{actionsLabel.subtitle}</p>
        )}
        <div className="space-y-3">
          {nextActions.map((action, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-gray-700">{action}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
