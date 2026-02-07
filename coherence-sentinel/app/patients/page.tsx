'use client';

import { useApp, usePatientData } from '@/lib/context/app-context';
import { RiskBadge } from '@/components/alert-badge';
import { formatDate } from '@/lib/utils';
import { useState } from 'react';
import { X, FileText, AlertCircle } from 'lucide-react';
import { TrendChart } from '@/components/trend-chart';
import { getFullLabel } from '@/lib/myth-labels';

export default function PatientsPage() {
  const { patients, settings } = useApp();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

  const pageLabel = getFullLabel('patients', settings.viewMode);

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
      </div>

      {/* Patient list */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Patient
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Age / Sex
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Risk Level
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Visit
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {patients.map((patient) => (
              <tr key={patient.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{patient.name}</div>
                  <div className="text-sm text-gray-500">ID: {patient.id}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {patient.age}y, {patient.sex}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <RiskBadge level={patient.riskLevel} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(patient.lastVisit)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button
                    onClick={() => setSelectedPatientId(patient.id)}
                    className="text-green-600 hover:text-green-900 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Patient detail modal/panel */}
      {selectedPatientId && (
        <PatientDetailPanel
          patientId={selectedPatientId}
          onClose={() => setSelectedPatientId(null)}
        />
      )}
    </div>
  );
}

function PatientDetailPanel({ patientId, onClose }: { patientId: string; onClose: () => void }) {
  const { patients, settings } = useApp();
  const patient = patients.find(p => p.id === patientId);
  const patientData = usePatientData(patientId);

  if (!patient || !patientData.derived) return null;

  const { alerts, derived } = patientData;
  const latestCoherence = derived.coherenceIndex[derived.coherenceIndex.length - 1]?.value || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{patient.name}</h2>
            <p className="text-sm text-gray-500">Patient ID: {patient.id}</p>
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
          {/* Basic info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="text-sm text-gray-500">Age</div>
              <div className="text-lg font-medium">{patient.age} years</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Sex</div>
              <div className="text-lg font-medium">{patient.sex}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Risk Level</div>
              <div className="mt-1"><RiskBadge level={patient.riskLevel} /></div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Coherence</div>
              <div className="text-lg font-medium">{latestCoherence.toFixed(0)}/100</div>
            </div>
          </div>

          {/* Timeline chart */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Coherence Timeline</h3>
            <TrendChart
              data={derived.coherenceIndex}
              label="Coherence Index"
              color="hsl(142, 76%, 36%)"
              showArea
              height={200}
            />
          </div>

          {/* Alerts history */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Recent Alerts ({alerts.length})
            </h3>
            <div className="space-y-2">
              {alerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{alert.title}</div>
                    <div className="text-xs text-gray-500 mt-1">{formatDate(alert.timestamp)}</div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded ${
                    alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                    alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              ))}
              {alerts.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">No alerts for this patient</p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div>
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notes
            </h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{patient.notes || 'No notes available.'}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium">
              Generate Report
            </button>
            <button className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium">
              Edit Patient
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
