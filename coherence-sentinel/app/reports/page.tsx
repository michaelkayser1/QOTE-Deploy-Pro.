'use client';

import { useApp, useSelectedPatient, usePatientData } from '@/lib/context/app-context';
import { getFullLabel } from '@/lib/myth-labels';
import { formatDate, formatDateTime, formatNumber } from '@/lib/utils';
import { FileText, Download, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { useState } from 'react';

export default function ReportsPage() {
  const { settings } = useApp();
  const patient = useSelectedPatient();
  const patientData = usePatientData(patient?.id || '');
  const [showPreview, setShowPreview] = useState(false);

  const pageLabel = getFullLabel('reports', settings.viewMode);

  if (!patient || !patientData.derived) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-gray-500">Please select a patient to generate a report.</p>
        </div>
      </div>
    );
  }

  const { derived, alerts } = patientData;
  const latestCoherence = derived.coherenceIndex[derived.coherenceIndex.length - 1]?.value || 0;
  const latestPhi = derived.phiProximity[derived.phiProximity.length - 1]?.value || 0;
  const latestWobble = derived.wobbleBudget[derived.wobbleBudget.length - 1]?.value || 0;
  const latestRankCollapse = derived.rankCollapseRisk[derived.rankCollapseRisk.length - 1]?.value || 0;

  const activeAlerts = alerts.filter(a => !a.resolvedAt);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
      </div>

      {/* Report options */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold mb-4">Generate Patient Report</h2>
        <p className="text-sm text-gray-600 mb-6">
          Patient: <span className="font-medium">{patient.name}</span> (ID: {patient.id})
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Comprehensive Report</option>
              <option>Alerts Summary</option>
              <option>Trends Analysis</option>
              <option>Protocol Recommendations</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Last 6 months</option>
              <option>All time</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowPreview(true)}
            className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2"
          >
            <FileText className="h-5 w-5" />
            {getFullLabel('generateReport', settings.viewMode).label}
          </button>
          <button className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export JSON
          </button>
        </div>
      </div>

      {/* Report preview */}
      {showPreview && (
        <div className="bg-white rounded-lg border border-gray-200 p-8 space-y-6">
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Patient Coherence Report</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated {formatDateTime(new Date())}
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">{patient.name}</div>
                <div className="text-sm text-gray-600">ID: {patient.id}</div>
                <div className="text-sm text-gray-600">{patient.age}y, {patient.sex}</div>
              </div>
            </div>
          </div>

          {/* Summary Section */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              Executive Summary
            </h3>
            <div className="bg-gray-50 rounded-lg p-4 space-y-2">
              <p className="text-sm">
                <strong>Overall Coherence:</strong> {formatNumber(latestCoherence, 0)}/100
                {' '}
                <span className={`font-medium ${
                  latestCoherence > 70 ? 'text-green-600' :
                  latestCoherence > 40 ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  ({latestCoherence > 70 ? 'Good' : latestCoherence > 40 ? 'Moderate' : 'Needs Attention'})
                </span>
              </p>
              <p className="text-sm">
                <strong>Risk Level:</strong> {patient.riskLevel.charAt(0).toUpperCase() + patient.riskLevel.slice(1)}
              </p>
              <p className="text-sm">
                <strong>Active Alerts:</strong> {activeAlerts.length}
              </p>
              <p className="text-sm">
                <strong>Reporting Period:</strong> Last 90 days ({formatDate(new Date(Date.now() - 90 * 24 * 60 * 60 * 1000))} - {formatDate(new Date())})
              </p>
            </div>
          </section>

          {/* Key Metrics */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Key Metrics (Current Values)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricBox
                label={getFullLabel('coherenceIndex', settings.viewMode).label}
                value={formatNumber(latestCoherence, 0) + '/100'}
                status={latestCoherence > 70 ? 'good' : latestCoherence > 40 ? 'moderate' : 'poor'}
              />
              <MetricBox
                label={getFullLabel('phiProximity', settings.viewMode).label}
                value={formatNumber(latestPhi, 2)}
                status={latestPhi > 0.7 ? 'good' : latestPhi > 0.4 ? 'moderate' : 'poor'}
              />
              <MetricBox
                label={getFullLabel('wobbleBudget', settings.viewMode).label}
                value={formatNumber(latestWobble, 0) + '%'}
                status={latestWobble > 60 ? 'good' : latestWobble > 40 ? 'moderate' : 'poor'}
              />
              <MetricBox
                label={getFullLabel('rankCollapseRisk', settings.viewMode).label}
                value={formatNumber(latestRankCollapse, 2)}
                status={latestRankCollapse < 0.3 ? 'good' : latestRankCollapse < 0.6 ? 'moderate' : 'poor'}
              />
            </div>
          </section>

          {/* Trends */}
          <section>
            <h3 className="text-xl font-semibold mb-4">90-Day Trends</h3>
            <div className="space-y-2 text-sm">
              <TrendLine label="Coherence Index" trend="stable" value="Stable around 65-75" />
              <TrendLine label="φ-Proximity" trend={latestPhi > 0.6 ? 'improving' : 'declining'} value={`Current: ${formatNumber(latestPhi, 2)}`} />
              <TrendLine label="Wobble Budget" trend={latestWobble > 50 ? 'stable' : 'declining'} value={`${formatNumber(latestWobble, 0)}%`} />
              <TrendLine label="Metabolic Drift" trend="stable" value="Within normal range" />
            </div>
          </section>

          {/* Alerts */}
          <section>
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Recent Alerts ({alerts.slice(0, 5).length} of {alerts.length})
            </h3>
            <div className="space-y-2">
              {alerts.slice(0, 5).map(alert => (
                <div key={alert.id} className="bg-gray-50 rounded p-3 text-sm">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{alert.title}</div>
                      <div className="text-gray-600 text-xs mt-1">{formatDateTime(alert.timestamp)}</div>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded ${
                      alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                      alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {alert.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommendations */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Plan & Recommendations</h3>
            <div className="space-y-2">
              {latestWobble < 40 && (
                <RecommendationItem text="Implement wobble budget expansion protocol" />
              )}
              {latestPhi < 0.5 && (
                <RecommendationItem text="Review autonomic coherence practices to improve φ-proximity" />
              )}
              {latestRankCollapse > 0.6 && (
                <RecommendationItem text="High rank collapse risk - consider behavioral diversification interventions" />
              )}
              {activeAlerts.length > 0 && (
                <RecommendationItem text={`Address ${activeAlerts.length} active alert(s)`} />
              )}
              <RecommendationItem text="Continue regular monitoring and weekly trend reviews" />
            </div>
          </section>

          {/* Notes */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Clinical Notes</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{patient.notes || 'No additional notes.'}</p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-gray-200 pt-6 text-xs text-gray-500">
            <p><strong>Disclaimer:</strong> {getFullLabel('disclaimer', settings.viewMode).label}</p>
            <p className="mt-2">
              This report was generated using demo data. All metrics and recommendations are for illustration purposes only.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Download PDF
            </button>
            <button className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium">
              Email Report
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, status }: {
  label: string;
  value: string;
  status: 'good' | 'moderate' | 'poor';
}) {
  const colors = {
    good: 'border-green-200 bg-green-50',
    moderate: 'border-yellow-200 bg-yellow-50',
    poor: 'border-red-200 bg-red-50'
  };

  return (
    <div className={`border-2 rounded-lg p-3 ${colors[status]}`}>
      <div className="text-xs text-gray-600 mb-1">{label}</div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}

function TrendLine({ label, trend, value }: {
  label: string;
  trend: 'improving' | 'stable' | 'declining';
  value: string;
}) {
  const icons = {
    improving: '↗',
    stable: '→',
    declining: '↘'
  };

  const colors = {
    improving: 'text-green-600',
    stable: 'text-gray-600',
    declining: 'text-red-600'
  };

  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2">
        <span className={`font-bold ${colors[trend]}`}>{icons[trend]}</span>
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-gray-600">{value}</span>
    </div>
  );
}

function RecommendationItem({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-2 py-2">
      <span className="text-green-600 mt-1">✓</span>
      <span className="text-sm">{text}</span>
    </div>
  );
}
