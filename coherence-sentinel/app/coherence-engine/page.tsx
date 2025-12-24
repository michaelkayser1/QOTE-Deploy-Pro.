'use client';

import { useApp, useSelectedPatient, usePatientData } from '@/lib/context/app-context';
import { getFullLabel } from '@/lib/myth-labels';
import { GlyphRing } from '@/components/glyph-ring';
import { useState } from 'react';
import { simulateWobble } from '@/lib/coherence/engine';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';

export default function CoherenceEnginePage() {
  const { settings } = useApp();
  const patient = useSelectedPatient();
  const patientData = usePatientData(patient?.id || '');

  const pageLabel = getFullLabel('coherenceEngine', settings.viewMode);

  // Wobble simulator state
  const [stiffness, setStiffness] = useState(0.5);
  const [damping, setDamping] = useState(0.1);
  const [shockAmplitude, setShockAmplitude] = useState(5);
  const [shockTime, setShockTime] = useState(2);

  // Run simulation
  const simulation = simulateWobble({
    initialPosition: 0,
    initialVelocity: 0,
    stiffness,
    damping,
    shockAmplitude,
    shockTime,
    duration: 10,
    dt: 0.05
  });

  const simData = simulation.time.map((t, i) => ({
    time: t.toFixed(2),
    position: simulation.position[i],
    energy: simulation.energy[i]
  }));

  const latestCoherence = patientData.derived?.coherenceIndex[patientData.derived.coherenceIndex.length - 1]?.value || 0;
  const latestPhi = patientData.derived?.phiProximity[patientData.derived.phiProximity.length - 1]?.value || 0;
  const latestWobble = patientData.derived?.wobbleBudget[patientData.derived.wobbleBudget.length - 1]?.value || 0;

  return (
    <div className="p-6 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{pageLabel.label}</h1>
        {pageLabel.subtitle && settings.viewMode === 'myth' && (
          <p className="text-sm text-gray-600 italic mt-1">{pageLabel.subtitle}</p>
        )}
      </div>

      {/* Current patient state visualization */}
      {patient && patientData.derived && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4">Current State Visualization</h3>
          <p className="text-sm text-gray-600 mb-4">
            Patient: <span className="font-medium">{patient.name}</span>
          </p>
          <div className="flex justify-center">
            <GlyphRing
              coherence={latestCoherence}
              phiProximity={latestPhi}
              wobbleBudget={latestWobble}
              size={250}
              animate={!settings.reducedMotion}
            />
          </div>
        </div>
      )}

      {/* Math sections */}
      <div className="space-y-4">
        <MathSection
          title="φ-Proximity (Phi-Proximity)"
          clinical="Measures alignment to mathematical coherence patterns using eigenspectral analysis."
          myth="Distance to the golden harmonic — how close the system orbits the φ-attractor."
          defaultOpen
        >
          <div className="space-y-3 text-sm">
            <p><strong>Current Implementation (Placeholder):</strong></p>
            <div className="bg-gray-100 p-3 rounded font-mono text-xs">
              φ-proximity ≈ (autocorr + 1)/2 × (1 - min(σ/μ, 1))
            </div>
            <p className="text-yellow-800 bg-yellow-50 p-3 rounded">
              <strong>TODO for Production:</strong> Replace with full PCA/eigenspectra pipeline:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Construct covariance matrix from multivariate time series</li>
              <li>Compute eigenvalues and eigenvectors via SVD</li>
              <li>Calculate spectral gap ratio (λ₁ / λ₂)</li>
              <li>Map to [0,1] via golden ratio proximity measure: |gap - φ| / φ</li>
              <li>Consider Hopf normal form projections for phase dynamics</li>
            </ul>
          </div>
        </MathSection>

        <MathSection
          title="Low-Rank Convergence"
          clinical="Detects when system dynamics converge to low-dimensional subspace, indicating reduced degrees of freedom."
          myth="Watching for the system's collapse into a crystallized attractor — when all paths lead to one."
        >
          <div className="space-y-3 text-sm">
            <p><strong>Current Implementation (Placeholder):</strong></p>
            <div className="bg-gray-100 p-3 rounded font-mono text-xs">
              Effective rank ≈ exp(Shannon entropy of normalized eigenvalues)
            </div>
            <p className="text-yellow-800 bg-yellow-50 p-3 rounded">
              <strong>TODO for Production:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Perform full SVD on state-space trajectory matrix</li>
              <li>Track rank evolution over sliding windows</li>
              <li>Detect rank collapse events (sudden drops in effective dimensionality)</li>
              <li>Compute participation ratio: (Σλᵢ)² / Σλᵢ²</li>
            </ul>
          </div>
        </MathSection>

        <MathSection
          title="Wobble Model"
          clinical="Spring-mass-damper model for system perturbations and recovery dynamics."
          myth="The sacred oscillation — how the guardian sways and returns to center when nudged."
        >
          <div className="space-y-3 text-sm">
            <p><strong>Equation of Motion:</strong></p>
            <div className="bg-gray-100 p-3 rounded font-mono text-xs">
              m ẍ + c ẋ + k x = F(t)
            </div>
            <p>Where:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>k</strong>: Stiffness (restoring force constant)</li>
              <li><strong>c</strong>: Damping coefficient</li>
              <li><strong>F(t)</strong>: External perturbation (shock)</li>
            </ul>
            <p className="text-blue-800 bg-blue-50 p-3 rounded">
              Try the simulator below to see how different parameters affect system response.
            </p>
          </div>
        </MathSection>
      </div>

      {/* Wobble Simulator */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold mb-4">Interactive Wobble Simulator</h3>
        <p className="text-sm text-gray-600 mb-6">
          Adjust parameters to see how the system responds to perturbations.
        </p>

        {/* Controls */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Stiffness: {stiffness.toFixed(2)}
              </label>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[stiffness]}
                onValueChange={([val]) => setStiffness(val)}
                min={0.1}
                max={2}
                step={0.1}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-green-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-green-600 rounded-full shadow" />
              </Slider.Root>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Damping: {damping.toFixed(2)}
              </label>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[damping]}
                onValueChange={([val]) => setDamping(val)}
                min={0}
                max={0.5}
                step={0.01}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-green-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-green-600 rounded-full shadow" />
              </Slider.Root>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Shock Amplitude: {shockAmplitude.toFixed(1)}
              </label>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[shockAmplitude]}
                onValueChange={([val]) => setShockAmplitude(val)}
                min={0}
                max={20}
                step={0.5}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-green-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-green-600 rounded-full shadow" />
              </Slider.Root>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Shock Time: {shockTime.toFixed(1)}s
              </label>
              <Slider.Root
                className="relative flex items-center select-none touch-none w-full h-5"
                value={[shockTime]}
                onValueChange={([val]) => setShockTime(val)}
                min={0}
                max={10}
                step={0.5}
              >
                <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                  <Slider.Range className="absolute bg-green-600 rounded-full h-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-5 h-5 bg-white border-2 border-green-600 rounded-full shadow" />
              </Slider.Root>
            </div>
          </div>
        </div>

        {/* Simulation results */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">Position Response</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Position', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="position" stroke="hsl(142, 76%, 36%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Energy (Kinetic + Potential)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={simData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" label={{ value: 'Time (s)', position: 'insideBottom', offset: -5 }} />
                <YAxis label={{ value: 'Energy', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="energy" stroke="hsl(24, 95%, 53%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function MathSection({ title, clinical, myth, defaultOpen = false, children }: {
  title: string;
  clinical: string;
  myth: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { settings } = useApp();

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <div className="flex-1">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">
            {settings.viewMode === 'clinical' ? clinical : myth}
          </p>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
      </button>
      {isOpen && (
        <div className="px-6 pb-4 border-t border-gray-200 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}
