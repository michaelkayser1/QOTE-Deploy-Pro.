'use client';

import { useApp, useSelectedPatient, usePatientAlerts } from '@/lib/context/app-context';
import { getFullLabel } from '@/lib/myth-labels';
import { AlertBadge } from '@/components/alert-badge';
import { formatDateTime } from '@/lib/utils';
import { useState } from 'react';
import { X, CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { Alert } from '@/lib/types';

export default function AlertsPage() {
  const { settings, alerts: allAlerts } = useApp();
  const patient = useSelectedPatient();
  const patientAlerts = patient ? usePatientAlerts(patient.id) : allAlerts;

  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('active');

  const pageLabel = getFullLabel('alerts', settings.viewMode);

  const filteredAlerts = patientAlerts.filter(alert => {
    if (filter === 'active') return !alert.resolvedAt;
    if (filter === 'resolved') return !!alert.resolvedAt;
    return true;
  });

  const activeCount = patientAlerts.filter(a => !a.resolvedAt).length;
  const resolvedCount = patientAlerts.filter(a => !!a.resolvedAt).length;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
        {patient && (
          <p className="text-sm text-gray-600 mt-2">
            Patient: <span className="font-medium">{patient.name}</span>
          </p>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'all'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All ({patientAlerts.length})
        </button>
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'active'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Active ({activeCount})
          </span>
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-4 py-2 rounded-lg font-medium ${
            filter === 'resolved'
              ? 'bg-green-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <span className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Resolved ({resolvedCount})
          </span>
        </button>
      </div>

      {/* Alerts table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alert
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Severity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Timestamp
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAlerts.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  No alerts found
                </td>
              </tr>
            ) : (
              filteredAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                    <div className="text-sm text-gray-500 truncate max-w-md">{alert.description}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AlertBadge severity={alert.severity} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(alert.confidence * 100).toFixed(0)}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDateTime(alert.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alert.resolvedAt ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-800 bg-green-100 rounded">
                        <CheckCircle2 className="h-3 w-3" />
                        Resolved
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 rounded">
                        <AlertTriangle className="h-3 w-3" />
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => setSelectedAlert(alert)}
                      className="text-green-600 hover:text-green-900 font-medium"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Alert detail panel */}
      {selectedAlert && (
        <AlertDetailPanel
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}

function AlertDetailPanel({ alert, onClose }: { alert: Alert; onClose: () => void }) {
  const { settings, patients, protocolModules } = useApp();

  const patient = patients.find(p => p.id === alert.patientId);
  const suggestedProtocols = protocolModules.filter(p => alert.suggestedProtocols.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertBadge severity={alert.severity} />
            <h2 className="text-xl font-bold text-gray-900">{alert.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Meta info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">Patient</div>
              <div className="font-medium">{patient?.name || alert.patientId}</div>
            </div>
            <div>
              <div className="text-gray-500">Timestamp</div>
              <div className="font-medium">{formatDateTime(alert.timestamp)}</div>
            </div>
            <div>
              <div className="text-gray-500">Confidence</div>
              <div className="font-medium">{(alert.confidence * 100).toFixed(0)}%</div>
            </div>
            <div>
              <div className="text-gray-500">Status</div>
              <div className="font-medium">
                {alert.resolvedAt ? `Resolved ${formatDateTime(alert.resolvedAt)}` : 'Active'}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{alert.description}</p>
          </div>

          {/* What triggered it */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Trigger Criteria</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">
                {alert.type === 'phi-proximity-drop' && 'φ-proximity decreased by >20% over 7 days'}
                {alert.type === 'metabolic-drift' && 'Metabolic drift (lactate:glucose ratio) exceeded threshold'}
                {alert.type === 'hrv-collapse' && 'Heart rate variability showed significant instability'}
                {alert.type === 'rank-collapse' && 'Rank collapse risk exceeded 0.6 threshold'}
                {alert.type === 'wobble-depletion' && 'Wobble budget fell below 30%'}
              </p>
            </div>
          </div>

          {/* Suggested protocols */}
          {suggestedProtocols.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Suggested Protocols</h3>
              <div className="space-y-2">
                {suggestedProtocols.map(protocol => (
                  <div key={protocol.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium">{protocol.name}</div>
                        <div className="text-sm text-gray-600 mt-1">{protocol.description}</div>
                      </div>
                      <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {protocol.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            {!alert.resolvedAt && (
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
                Mark as Resolved
              </button>
            )}
            <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium">
              Add to Patient Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
