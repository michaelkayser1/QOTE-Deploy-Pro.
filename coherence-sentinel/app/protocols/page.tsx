'use client';

import { useApp, useSelectedPatient } from '@/lib/context/app-context';
import { getFullLabel } from '@/lib/myth-labels';
import { ProtocolModule } from '@/lib/types';
import { useState } from 'react';
import { X, Plus, AlertTriangle, CheckCircle2, FileText } from 'lucide-react';

export default function ProtocolsPage() {
  const { settings, protocolModules } = useApp();
  const patient = useSelectedPatient();
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolModule | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const pageLabel = getFullLabel('protocols', settings.viewMode);

  const filteredProtocols = protocolModules.filter(p => {
    if (filter === 'all') return true;
    return p.category === filter;
  });

  const categories = ['all', 'autonomic', 'metabolic', 'behavioral', 'experimental'];

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
        <p className="text-sm text-gray-600 mt-2">
          Protocol library and patient plan builder
        </p>
      </div>

      {/* Category filters */}
      <div className="flex items-center gap-3">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-lg font-medium capitalize ${
              filter === cat
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Protocol grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProtocols.map(protocol => (
          <ProtocolCard
            key={protocol.id}
            protocol={protocol}
            onSelect={() => setSelectedProtocol(protocol)}
          />
        ))}
      </div>

      {/* Protocol detail panel */}
      {selectedProtocol && (
        <ProtocolDetailPanel
          protocol={selectedProtocol}
          patient={patient}
          onClose={() => setSelectedProtocol(null)}
        />
      )}
    </div>
  );
}

function ProtocolCard({ protocol, onSelect }: {
  protocol: ProtocolModule;
  onSelect: () => void;
}) {
  const { settings } = useApp();

  const categoryColors = {
    autonomic: 'bg-blue-100 text-blue-800 border-blue-200',
    metabolic: 'bg-green-100 text-green-800 border-green-200',
    behavioral: 'bg-purple-100 text-purple-800 border-purple-200',
    experimental: 'bg-orange-100 text-orange-800 border-orange-200'
  };

  const categoryLabel = getFullLabel(`${protocol.category}Protocol`, settings.viewMode);

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{protocol.name}</h3>
          {settings.viewMode === 'myth' && categoryLabel.subtitle && (
            <p className="text-xs text-gray-500 italic mt-1">{categoryLabel.subtitle}</p>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded border ${categoryColors[protocol.category]}`}>
          {categoryLabel.label || protocol.category}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">{protocol.description}</p>

      {protocol.isExperimental && (
        <div className="flex items-center gap-2 text-xs text-orange-800 bg-orange-50 px-3 py-2 rounded mb-4">
          <AlertTriangle className="h-4 w-4" />
          <span>Experimental - Demo template only</span>
        </div>
      )}

      <div className="space-y-2 mb-4">
        <div className="text-xs text-gray-500">
          <strong>Indications:</strong> {protocol.indications.length}
        </div>
        <div className="text-xs text-gray-500">
          <strong>Steps:</strong> {protocol.steps.length}
        </div>
      </div>

      <button
        onClick={onSelect}
        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm"
      >
        View Full Protocol
      </button>
    </div>
  );
}

function ProtocolDetailPanel({ protocol, patient, onClose }: {
  protocol: ProtocolModule;
  patient: any;
  onClose: () => void;
}) {
  const { settings } = useApp();
  const addLabel = getFullLabel('addProtocol', settings.viewMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{protocol.name}</h2>
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded mt-1 inline-block">
              {protocol.category}
            </span>
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
          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{protocol.description}</p>
          </div>

          {protocol.isExperimental && (
            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                <div className="flex-1">
                  <div className="font-semibold text-orange-900">Experimental Protocol</div>
                  <p className="text-sm text-orange-800 mt-1">
                    This is a demo template only. Not for clinical use. Requires detailed risk-benefit analysis and robust monitoring framework.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Indications */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Indications
            </h3>
            <ul className="space-y-2">
              {protocol.indications.map((indication, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-green-600 mt-1">•</span>
                  <span className="text-gray-700">{indication}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contraindications */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Contraindications
            </h3>
            <ul className="space-y-2">
              {protocol.contraindications.map((contraindication, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-red-600 mt-1">•</span>
                  <span className="text-gray-700">{contraindication}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Steps */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              Protocol Steps
            </h3>
            <ol className="space-y-3">
              {protocol.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </span>
                  <span className="text-sm text-gray-700 pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Monitoring plan */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Monitoring Plan</h3>
            <ul className="space-y-2">
              {protocol.monitoringPlan.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-gray-600 mt-1">→</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          {patient && (
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                {addLabel.label}
              </button>
              <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-medium">
                Export PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
