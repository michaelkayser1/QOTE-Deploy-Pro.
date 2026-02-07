/**
 * Coherence Engine
 *
 * Core mathematical models for coherence calculations.
 * Current implementation uses placeholder formulas.
 *
 * TODO: Replace with actual PCA/eigenspectra pipeline for production use.
 */

import { TimeSeriesPoint } from '../types';

/**
 * Calculate φ-proximity (phi-proximity)
 *
 * Measures alignment to mathematical coherence patterns.
 *
 * PLACEHOLDER FORMULA:
 * Currently using a simplified proxy based on variance and autocorrelation.
 *
 * TODO: Implement full PCA-based eigenspectral analysis:
 * 1. Construct covariance matrix from multivariate time series
 * 2. Compute eigenvalues and eigenvectors
 * 3. Calculate spectral gap ratio
 * 4. Map to [0,1] range via golden ratio proximity measure
 */
export function calculatePhiProximity(
  timeSeries: number[],
  windowSize: number = 10
): number {
  if (timeSeries.length < windowSize) return 0;

  // Simple variance-based proxy
  const recentData = timeSeries.slice(-windowSize);
  const mean = recentData.reduce((a, b) => a + b, 0) / recentData.length;
  const variance = recentData.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / recentData.length;
  const stdDev = Math.sqrt(variance);

  // Autocorrelation proxy (lag-1)
  let autoCorr = 0;
  for (let i = 1; i < recentData.length; i++) {
    autoCorr += (recentData[i] - mean) * (recentData[i - 1] - mean);
  }
  autoCorr = autoCorr / ((recentData.length - 1) * variance);

  // Normalized coherence proxy
  // High autocorrelation + moderate variance = higher φ-proximity
  const phiProxy = (autoCorr + 1) / 2 * (1 - Math.min(stdDev / mean, 1));

  return Math.max(0, Math.min(1, phiProxy));
}

/**
 * Calculate coherence index (0-100)
 *
 * Composite metric combining multiple signals.
 *
 * PLACEHOLDER FORMULA:
 * Weighted average of component metrics.
 *
 * TODO: Implement proper multivariate coherence measure
 */
export function calculateCoherenceIndex(params: {
  phiProximity: number;
  autonomicStability: number;
  metabolicDrift: number;
  wobbleBudget: number;
}): number {
  const {
    phiProximity,
    autonomicStability,
    metabolicDrift,
    wobbleBudget
  } = params;

  // Weighted combination
  // φ-proximity: 35%, autonomic: 30%, metabolic: 20%, wobble: 15%
  const index = (
    phiProximity * 35 +
    autonomicStability * 0.30 +
    (1 - metabolicDrift) * 20 + // Lower drift is better
    wobbleBudget * 0.15
  );

  return Math.max(0, Math.min(100, index));
}

/**
 * Low-rank convergence analysis
 *
 * Detects when system is converging to low-dimensional subspace.
 *
 * PLACEHOLDER:
 * Simple variance ratio calculation.
 *
 * TODO: Full SVD-based rank analysis
 */
export function analyzeLowRankConvergence(
  matrix: number[][]
): {
  rank: number;
  convergenceScore: number;
  eigenvalues: number[];
} {
  // Placeholder: assume full rank and calculate simple variance ratios
  const n = Math.min(matrix.length, matrix[0]?.length || 0);

  // Dummy eigenvalues (normally from SVD)
  const eigenvalues = Array.from({ length: n }, (_, i) => 1 / (i + 1));

  // Calculate effective rank using eigenvalue distribution
  const totalVariance = eigenvalues.reduce((a, b) => a + b, 0);
  const normalizedEigenvalues = eigenvalues.map(e => e / totalVariance);

  // Shannon entropy-based rank estimate
  const entropy = -normalizedEigenvalues.reduce(
    (sum, p) => sum + (p > 0 ? p * Math.log(p) : 0),
    0
  );
  const maxEntropy = Math.log(n);
  const effectiveRank = Math.exp(entropy);

  // Convergence score: lower = more collapsed
  const convergenceScore = entropy / maxEntropy;

  return {
    rank: Math.round(effectiveRank),
    convergenceScore,
    eigenvalues: eigenvalues.slice(0, 5) // Top 5
  };
}

/**
 * Wobble model simulator
 *
 * Simulates system response to perturbations.
 */
export interface WobbleSimulation {
  time: number[];
  position: number[];
  velocity: number[];
  energy: number[];
}

export function simulateWobble(params: {
  initialPosition: number;
  initialVelocity: number;
  stiffness: number; // Spring constant
  damping: number; // Damping coefficient
  shockAmplitude: number;
  shockTime: number;
  duration: number;
  dt: number;
}): WobbleSimulation {
  const {
    initialPosition,
    initialVelocity,
    stiffness,
    damping,
    shockAmplitude,
    shockTime,
    duration,
    dt
  } = params;

  const steps = Math.floor(duration / dt);
  const time: number[] = [];
  const position: number[] = [];
  const velocity: number[] = [];
  const energy: number[] = [];

  let x = initialPosition;
  let v = initialVelocity;

  for (let i = 0; i < steps; i++) {
    const t = i * dt;
    time.push(t);
    position.push(x);
    velocity.push(v);

    // Energy (kinetic + potential)
    const ke = 0.5 * v * v;
    const pe = 0.5 * stiffness * x * x;
    energy.push(ke + pe);

    // Apply shock at specified time
    let force = -stiffness * x - damping * v;
    if (Math.abs(t - shockTime) < dt / 2) {
      force += shockAmplitude;
    }

    // Simple Euler integration
    const a = force;
    v += a * dt;
    x += v * dt;
  }

  return { time, position, velocity, energy };
}

/**
 * Calculate metabolic drift
 *
 * Ratio of lactate to glucose.
 * Higher values indicate metabolic stress.
 */
export function calculateMetabolicDrift(
  lactate: number, // mmol/L
  glucose: number  // mg/dL
): number {
  // Convert glucose to mmol/L (divide by 18)
  const glucoseMmol = glucose / 18;
  return lactate / glucoseMmol;
}

/**
 * Calculate autonomic stability from HRV
 *
 * Implements frequency-domain analysis (LF/HF ratio) for HRV assessment.
 *
 * LF (Low Frequency): 0.04-0.15 Hz - sympathetic and parasympathetic activity
 * HF (High Frequency): 0.15-0.4 Hz - parasympathetic (vagal) activity
 * LF/HF ratio: autonomic balance indicator
 */
export function calculateAutonomicStability(
  hrvValues: number[], // HRV in milliseconds
  samplingRate: number = 4 // Hz, typical for HRV measurements
): number {
  if (hrvValues.length < 10) return 0;

  // Remove mean (detrend)
  const mean = hrvValues.reduce((a, b) => a + b, 0) / hrvValues.length;
  const detrendedHRV = hrvValues.map(v => v - mean);

  // Calculate power spectral density using periodogram approach
  const N = hrvValues.length;
  const frequencyResolution = samplingRate / N;

  // Frequency bands
  const LF_MIN = 0.04; // Hz
  const LF_MAX = 0.15; // Hz
  const HF_MIN = 0.15; // Hz
  const HF_MAX = 0.4;  // Hz

  let lfPower = 0;
  let hfPower = 0;

  // Calculate power spectrum using DFT for relevant frequencies
  // We only need to calculate for LF and HF bands, not full spectrum
  for (let k = 0; k < N / 2; k++) {
    const freq = k * frequencyResolution;

    // Skip frequencies outside our bands of interest
    if (freq < LF_MIN || freq > HF_MAX) continue;

    // Calculate DFT coefficient for this frequency
    let real = 0;
    let imag = 0;
    for (let n = 0; n < N; n++) {
      const angle = (2 * Math.PI * k * n) / N;
      real += detrendedHRV[n] * Math.cos(angle);
      imag += detrendedHRV[n] * Math.sin(angle);
    }

    // Power = |X[k]|^2 / N
    const power = (real * real + imag * imag) / N;

    // Accumulate power in appropriate band
    if (freq >= LF_MIN && freq < LF_MAX) {
      lfPower += power;
    } else if (freq >= HF_MIN && freq <= HF_MAX) {
      hfPower += power;
    }
  }

  // Calculate LF/HF ratio
  const lfHfRatio = hfPower > 0 ? lfPower / hfPower : 10; // Default to high ratio if no HF power

  // Convert LF/HF ratio to stability score (0-100)
  // Optimal LF/HF ratio is typically 1-3
  // Lower ratio (< 1) or very high ratio (> 10) indicates imbalance
  let stability: number;
  if (lfHfRatio >= 1 && lfHfRatio <= 3) {
    // Optimal range - high stability
    stability = 100 - (Math.abs(lfHfRatio - 2) / 1) * 20; // Peak at ratio = 2
  } else if (lfHfRatio < 1) {
    // Low ratio - parasympathetic dominance
    stability = 60 + lfHfRatio * 20;
  } else {
    // High ratio - sympathetic dominance
    stability = Math.max(0, 60 - (lfHfRatio - 3) * 10);
  }

  return Math.max(0, Math.min(100, stability));
}

/**
 * Calculate rank collapse risk
 *
 * Measures representation monoculture / system rigidity.
 *
 * PLACEHOLDER: Based on signal diversity metrics.
 *
 * TODO: Implement proper state-space dimensionality analysis
 */
export function calculateRankCollapseRisk(
  signals: number[][], // Matrix of different signals over time
  windowSize: number = 7
): number {
  if (signals.length === 0 || signals[0].length < windowSize) return 0;

  // Calculate correlation between signals
  const recentSignals = signals.map(s => s.slice(-windowSize));

  // Count distinct patterns (simplified)
  const variances = recentSignals.map(s => {
    const mean = s.reduce((a, b) => a + b, 0) / s.length;
    return s.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / s.length;
  });

  // Low variance diversity = high collapse risk
  const meanVariance = variances.reduce((a, b) => a + b, 0) / variances.length;
  const varianceOfVariances = variances.reduce((sum, val) => sum + Math.pow(val - meanVariance, 2), 0) / variances.length;

  // Normalize to 0-1 range
  const diversityScore = Math.sqrt(varianceOfVariances) / (meanVariance || 1);
  const collapseRisk = 1 / (1 + diversityScore);

  return Math.max(0, Math.min(1, collapseRisk));
}

/**
 * Calculate wobble budget
 *
 * Measures available capacity for productive exploration.
 *
 * PLACEHOLDER: Based on signal variance and stability.
 *
 * TODO: Implement proper safe exploration zone calculation
 */
export function calculateWobbleBudget(
  coherenceIndex: number,
  autonomicStability: number,
  recentPerturbations: number[] // History of system responses
): number {
  // Higher baseline coherence and stability = more wobble budget
  const baselineCapacity = (coherenceIndex + autonomicStability) / 2;

  // Recent perturbation history affects available budget
  const recentStress = recentPerturbations.length > 0
    ? recentPerturbations.reduce((a, b) => a + b, 0) / recentPerturbations.length
    : 0;

  // Budget = baseline capacity - recent utilization
  const budget = baselineCapacity * (1 - Math.min(recentStress, 0.5));

  return Math.max(0, Math.min(100, budget));
}
