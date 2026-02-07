'use client';

import { useApp } from '@/lib/context/app-context';
import { getFullLabel } from '@/lib/myth-labels';
import * as Switch from '@radix-ui/react-switch';
import { Settings as SettingsIcon, Eye, Zap, Upload } from 'lucide-react';

export default function SettingsPage() {
  const { settings, updateSettings } = useApp();

  const pageLabel = getFullLabel('settings', 'clinical');

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-600 mt-1">
          Configure application preferences and display options
        </p>
      </div>

      {/* Settings sections */}
      <div className="space-y-6">
        {/* Display Settings */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Eye className="h-5 w-5 text-green-600" />
            Display Settings
          </h2>

          <div className="space-y-6">
            {/* View Mode */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">View Mode</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Switch between clinical terminology and mythic/poetic interpretations. The myth layer changes labels and adds subtitles but never changes data.
                </p>
              </div>
              <div className="ml-4">
                <select
                  value={settings.viewMode}
                  onChange={(e) => updateSettings({ viewMode: e.target.value as 'clinical' | 'myth' })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="clinical">Clinical</option>
                  <option value="myth">Myth Layer</option>
                </select>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-900">
                  <strong>About Myth Layer:</strong> This mode relabels metrics and UI elements with poetic/mythic language. For example:
                </p>
                <ul className="text-sm text-blue-900 mt-2 space-y-1 ml-4">
                  <li>• Coherence Index → Guardian Clarity</li>
                  <li>• Alerts → Rim Warnings</li>
                  <li>• Next Best Actions → Deliberate Wobble Moves</li>
                </ul>
                <p className="text-sm text-blue-900 mt-2">
                  All underlying data and calculations remain identical.
                </p>
              </div>
            </div>

            {/* Reduced Motion */}
            <div className="flex items-start justify-between border-t border-gray-200 pt-6">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Reduced Motion</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Minimize animations and transitions for improved accessibility
                </p>
              </div>
              <Switch.Root
                checked={settings.reducedMotion}
                onCheckedChange={(checked) => updateSettings({ reducedMotion: checked })}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
              >
                <Switch.Thumb className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform data-[state=checked]:translate-x-6 data-[state=unchecked]:translate-x-1" />
              </Switch.Root>
            </div>

            {/* Theme (placeholder) */}
            <div className="flex items-start justify-between border-t border-gray-200 pt-6">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Theme</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose your preferred color theme (currently light mode only)
                </p>
              </div>
              <div className="ml-4">
                <select
                  value={settings.theme}
                  onChange={(e) => updateSettings({ theme: e.target.value as 'light' | 'dark' })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  disabled
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark (Coming Soon)</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Data Settings */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Upload className="h-5 w-5 text-green-600" />
            Data Settings
          </h2>

          <div className="space-y-6">
            {/* Data Source */}
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">Data Source</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Choose between demo data or uploaded CSV files
                </p>
              </div>
              <div className="ml-4">
                <select
                  value={settings.dataSource}
                  onChange={(e) => updateSettings({ dataSource: e.target.value as 'demo' | 'uploaded' })}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="demo">Demo Data</option>
                  <option value="uploaded">Uploaded CSV (Not Implemented)</option>
                </select>
              </div>
            </div>

            {/* CSV Upload (placeholder) */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="font-medium text-gray-900 mb-3">Upload Data</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload CSV files with patient data (placeholder - not implemented)
                </p>
                <button
                  disabled
                  className="px-4 py-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                >
                  Choose File
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy & Disclaimers */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-green-600" />
            Privacy & Disclaimers
          </h2>

          <div className="space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Data Privacy</h3>
              <p className="text-sm text-gray-700">
                All data in this demo application is local and not transmitted to any external servers. This is a research prototype and not intended for production use with real patient data.
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-medium text-yellow-900 mb-2">Important Disclaimer</h3>
              <p className="text-sm text-yellow-800">
                {getFullLabel('disclaimer', settings.viewMode).label}
              </p>
              <p className="text-sm text-yellow-800 mt-2">
                This application is a demonstration of coherence monitoring concepts using placeholder mathematical models. All calculations require validation and proper clinical implementation before any real-world use.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">About This Application</h3>
              <p className="text-sm text-blue-800">
                Coherence Sentinel is a clinical-style monitoring dashboard that tracks coherence signals (HRV/CGM/labs + derived metrics) with an optional mythic overlay. It demonstrates:
              </p>
              <ul className="text-sm text-blue-800 mt-2 space-y-1 ml-4">
                <li>• φ-proximity and coherence index calculations</li>
                <li>• Wobble budget and rank collapse risk monitoring</li>
                <li>• Alert system and protocol recommendations</li>
                <li>• Clinical/Myth mode toggle for different interpretive frames</li>
              </ul>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">Application Info</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Version:</span>
              <span className="font-medium">1.0.0 (Demo)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Framework:</span>
              <span className="font-medium">Next.js 16 (App Router)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Data Status:</span>
              <span className="font-medium">Demo / Synthetic</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Patients:</span>
              <span className="font-medium">6 (Demo)</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
