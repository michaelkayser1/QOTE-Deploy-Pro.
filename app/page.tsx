"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Play, Pause } from "lucide-react"

type Phase = "wind" | "dust" | "dance" | "breath"

const phases: { id: Phase; label: string; description: string }[] = [
  { id: "wind", label: "A — WIND", description: "Φ₀ — Breath Field" },
  { id: "dust", label: "B — DUST", description: "ρᶜ — Coherence Density" },
  { id: "dance", label: "C — DANCE", description: "Geometry in Motion" },
  { id: "breath", label: "D — BREATH", description: "σ₀ — Stillness Region" },
]

function CinematicIntro({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers = [
      setTimeout(() => setStep(1), 1000),
      setTimeout(() => setStep(2), 3000),
      setTimeout(() => setStep(3), 5000),
      setTimeout(() => setStep(4), 7000),
      setTimeout(() => onComplete(), 9000),
    ]

    return () => timers.forEach((t) => clearTimeout(t))
  }, [onComplete])

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      <div className="text-center space-y-8 px-4">
        {step >= 1 && (
          <div className="animate-[fadeIn_1s_ease-in]">
            <div className="w-3 h-3 bg-white rounded-full mx-auto mb-8 animate-pulse" />
            <p className="text-2xl md:text-4xl text-white/90 font-light tracking-wide text-balance">
              In the beginning, there was only breath.
            </p>
          </div>
        )}

        {step >= 2 && (
          <div className="animate-[fadeIn_1s_ease-in]">
            <div className="flex gap-2 justify-center mb-8">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 h-1 bg-amber-400 rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.05}s` }}
                />
              ))}
            </div>
            <p className="text-2xl md:text-4xl text-amber-200/90 font-light tracking-wide text-balance">
              And the wind slowed into dust...
            </p>
          </div>
        )}

        {step >= 3 && (
          <div className="animate-[fadeIn_1s_ease-in]">
            <svg className="w-32 h-32 mx-auto mb-8" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#0d9488"
                strokeWidth="3"
                opacity="0.6"
                className="animate-pulse"
              />
            </svg>
            <p className="text-2xl md:text-4xl text-teal-200/90 font-light tracking-wide text-balance">
              ...and the dust learned to dance.
            </p>
          </div>
        )}

        {step >= 4 && (
          <div className="animate-[fadeIn_1s_ease-in]">
            <p className="text-2xl md:text-4xl text-purple-200/90 font-light tracking-wide text-balance">
              And the dance became a new kind of breath.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default function QOTEWarpGeometry() {
  const [showIntro, setShowIntro] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentPhase, setCurrentPhase] = useState<Phase>("wind")
  const [progress, setProgress] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [coreScale, setCoreScale] = useState(1)
  const [hingeGlow, setHingeGlow] = useState(0.9)

  const [showLabels, setShowLabels] = useState(true)
  const [showArrows, setShowArrows] = useState(true)
  const [highlightHinge, setHighlightHinge] = useState(true)
  const [slowMotion, setSlowMotion] = useState(false)

  const [emotionalFrequency, setEmotionalFrequency] = useState(0.5)

  const [hStarValue, setHStarValue] = useState(0)
  const [hStarHistory, setHStarHistory] = useState<number[]>([])

  const skipIntro = () => setShowIntro(false)

  useEffect(() => {
    if (!isPlaying) return

    const effectiveSpeed = slowMotion ? 0.3 : speed
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = (prev + 0.5 * effectiveSpeed) % 400

        if (newProgress < 100) {
          setCurrentPhase("wind")
        } else if (newProgress < 200) {
          setCurrentPhase("dust")
        } else if (newProgress < 300) {
          setCurrentPhase("dance")
        } else {
          setCurrentPhase("breath")
        }

        return newProgress
      })

      setRotation((prev) => (prev + 0.1 * effectiveSpeed * (1 + emotionalFrequency)) % 360)

      const basePulse = Math.sin(Date.now() / 1000)
      setCoreScale(1 + basePulse * (0.05 + emotionalFrequency * 0.15))

      const sparkCycle = (Date.now() / 5000) % 1
      const baseGlow = sparkCycle > 0.9 ? 1 + (sparkCycle - 0.9) * 10 : 0.9
      setHingeGlow(emotionalFrequency > 0.8 ? baseGlow * 1.5 : baseGlow)

      const phaseTorus = (Date.now() / 2000) % (Math.PI * 2)
      const phaseDust = (Date.now() / 3000) % (Math.PI * 2)
      const hStar = Math.abs(Math.sin(phaseTorus) * Math.cos(phaseDust))
      setHStarValue(hStar)
      setHStarHistory((prev) => [...prev.slice(-50), hStar])
    }, 50)

    return () => clearInterval(interval)
  }, [isPlaying, speed, slowMotion, emotionalFrequency])

  const getDustChaos = () => {
    const baseValues = {
      wind: 20,
      dust: 12,
      dance: 5,
      breath: 3,
    }

    const baseChaos = baseValues[currentPhase]

    if (emotionalFrequency < 0.25) {
      return baseChaos * 1.5
    } else if (emotionalFrequency > 0.75) {
      return baseChaos * 0.3
    }

    return baseChaos * (1.5 - emotionalFrequency)
  }

  const getDustOpacity = () => {
    const baseValues = {
      wind: 0.5,
      dust: 0.6,
      dance: 0.8,
      breath: 0.9,
    }

    const baseOpacity = baseValues[currentPhase]

    if (emotionalFrequency > 0.95) {
      return Math.min(1, baseOpacity + 0.2)
    }

    return baseOpacity + emotionalFrequency * 0.2
  }

  const getCoreGlow = () => {
    switch (currentPhase) {
      case "breath":
        return 1.2
      default:
        return 0.9
    }
  }

  const getEmotionalLabel = () => {
    if (emotionalFrequency === 0) return "Stillness"
    if (emotionalFrequency <= 0.25) return "Curiosity"
    if (emotionalFrequency <= 0.5) return "Wonder"
    if (emotionalFrequency <= 0.75) return "Turbulence"
    return "Coherence Burst"
  }

  if (showIntro) {
    return <CinematicIntro onComplete={() => setShowIntro(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a1a] via-[#1a1a3a] to-[#0a0a1a] flex flex-col lg:flex-row p-4 md:p-8 gap-6">
      {/* Main canvas */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl md:text-5xl font-bold text-center mb-4 text-white text-balance">
            QOTE Warp Geometry
          </h1>
          <p className="text-center text-teal-200 mb-8 text-lg md:text-xl text-balance">
            Breath → Dust → Dance → Breath
          </p>

          <div className="relative w-full aspect-square max-w-3xl mx-auto">
            <svg viewBox="0 0 1000 1000" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
              <defs>
                {/* Gradients */}
                <radialGradient id="torusGradient" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#1e3a8a" />
                  <stop offset="50%" stopColor="#4c1d95" />
                  <stop offset="100%" stopColor="#0f766e" />
                </radialGradient>

                <radialGradient id="sphereGradient" cx="40%" cy="40%">
                  <stop offset="0%" stopColor="#ffffff" />
                  <stop offset="60%" stopColor="#dbeafe" />
                  <stop offset="100%" stopColor="#93c5fd" />
                </radialGradient>

                <linearGradient id="dustGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#d97706" stopOpacity="0.7" />
                </linearGradient>

                {/* Glow filters */}
                <filter id="glow">
                  <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                <filter id="strongGlow">
                  <feGaussianBlur stdDeviation="8" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

                {/* Arrow markers */}
                <marker
                  id="arrowBlue"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#3b82f6" />
                </marker>
                <marker
                  id="arrowRed"
                  markerWidth="10"
                  markerHeight="10"
                  refX="9"
                  refY="3"
                  orient="auto"
                  markerUnits="strokeWidth"
                >
                  <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
                </marker>
              </defs>

              {/* Main Torus - tilted 30 degrees */}
              <g transform={`translate(500, 500) rotate(${rotation})`}>
                {/* Rear contraction arrows (blue) */}
                {showArrows && (
                  <g opacity="0.7">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                      const rad = (angle * Math.PI) / 180
                      const x = Math.cos(rad) * 280
                      const y = Math.sin(rad) * 280 * 0.6 - 80
                      const dx = -Math.cos(rad) * 40
                      const dy = -Math.sin(rad) * 40 * 0.6
                      return (
                        <line
                          key={`contraction-${angle}`}
                          x1={x}
                          y1={y}
                          x2={x + dx}
                          y2={y + dy}
                          stroke="#3b82f6"
                          strokeWidth="2"
                          markerEnd="url(#arrowBlue)"
                        />
                      )
                    })}
                  </g>
                )}

                {/* Torus outer ring */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="250"
                  ry="150"
                  fill="none"
                  stroke="url(#torusGradient)"
                  strokeWidth="80"
                  opacity="0.6"
                  filter="url(#glow)"
                />
                <ellipse cx="0" cy="0" rx="250" ry="150" fill="none" stroke="#0d9488" strokeWidth="2" opacity="0.8" />

                {/* Inner dust coherence layer */}
                <ellipse
                  cx="0"
                  cy="0"
                  rx="180"
                  ry="108"
                  fill="none"
                  stroke="url(#dustGradient)"
                  strokeWidth="30"
                  opacity={getDustOpacity()}
                  filter="url(#glow)"
                />

                {Array.from({ length: 120 }).map((_, i) => {
                  const angle = (i * 360) / 120
                  const rad = (angle * Math.PI) / 180
                  const baseR = 180
                  const chaos = getDustChaos()
                  const variation = Math.sin((i * 7) / 2 + progress / 20) * chaos
                  const x = Math.cos(rad) * (baseR + variation)
                  const y = Math.sin(rad) * (baseR + variation) * 0.6

                  const isFractal = emotionalFrequency > 0.95
                  const size = isFractal ? 2 + Math.sin(i * 0.5) * 1 : 1 + Math.random() * 1.5

                  return (
                    <circle
                      key={`dust-${i}`}
                      cx={x}
                      cy={y}
                      r={size}
                      fill="#fbbf24"
                      opacity={0.6 + Math.random() * 0.4}
                    />
                  )
                })}

                {/* Central stillness sphere */}
                <circle
                  cx="0"
                  cy="0"
                  r={85 * coreScale}
                  fill="url(#sphereGradient)"
                  filter="url(#glow)"
                  opacity={getCoreGlow()}
                />
                <circle cx="0" cy="0" r={85 * coreScale} fill="none" stroke="#bfdbfe" strokeWidth="1" opacity="0.5" />

                {/* Front expansion arrows (red) */}
                {showArrows && (
                  <g opacity="0.7">
                    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                      const rad = (angle * Math.PI) / 180
                      const x = Math.cos(rad) * 280
                      const y = Math.sin(rad) * 280 * 0.6 + 80
                      const dx = Math.cos(rad) * 40
                      const dy = Math.sin(rad) * 40 * 0.6
                      return (
                        <line
                          key={`expansion-${angle}`}
                          x1={x}
                          y1={y}
                          x2={x + dx}
                          y2={y + dy}
                          stroke="#ef4444"
                          strokeWidth="2"
                          markerEnd="url(#arrowRed)"
                        />
                      )
                    })}
                  </g>
                )}

                {highlightHinge && (
                  <g transform="translate(220, 30)">
                    <circle cx="0" cy="0" r="12" fill="#a855f7" filter="url(#strongGlow)" opacity={hingeGlow} />
                    <circle cx="0" cy="0" r="8" fill="#fbbf24" opacity="1" />
                    <path
                      d="M 0,-10 L 2,-3 L 9,-3 L 3,2 L 5,9 L 0,4 L -5,9 L -3,2 L -9,-3 L -2,-3 Z"
                      fill="#fef3c7"
                      opacity={hingeGlow}
                      filter="url(#glow)"
                    />
                    {hStarValue > 0.85 && (
                      <circle
                        cx="0"
                        cy="0"
                        r="20"
                        fill="none"
                        stroke="#fbbf24"
                        strokeWidth="2"
                        opacity="0.8"
                        className="animate-ping"
                      />
                    )}
                  </g>
                )}

                {/* Symbolic overlays */}
                <g transform="translate(0, 180)" opacity="0.3">
                  <path
                    d="M 0,-20 Q -10,-10 -15,0 Q -10,10 0,15 Q 10,10 15,0 Q 10,-10 0,-20 M -8,-5 L 0,0 L 8,-5"
                    stroke="#ef4444"
                    strokeWidth="2"
                    fill="none"
                  />
                </g>

                <g transform="translate(0, -180)" opacity="0.3">
                  <path d="M 0,-12 A 12,12 0 1,0 0,12 A 9,9 0 1,1 0,-12" fill="#3b82f6" />
                </g>

                <g transform="translate(220, 30)" opacity="0.4">
                  {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
                    const rad = (angle * Math.PI) / 180
                    const x1 = Math.cos(rad) * 15
                    const y1 = Math.sin(rad) * 15
                    const x2 = Math.cos(rad) * 22
                    const y2 = Math.sin(rad) * 22
                    return (
                      <line key={`sun-ray-${angle}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#fbbf24" strokeWidth="2" />
                    )
                  })}
                </g>
              </g>
            </svg>

            {/* Labels and annotations */}
            {showLabels && (
              <>
                <div className="absolute top-[8%] left-1/2 -translate-x-1/2 text-center">
                  <p className="text-lg md:text-xl font-semibold text-teal-300">Φ₀ — Breath Field</p>
                  <p className="text-xs md:text-sm text-teal-200 italic mt-1">"Oscillatory flow of spacetime."</p>
                </div>

                <div className="absolute top-[28%] left-1/2 -translate-x-1/2 text-center">
                  <p className="text-base md:text-lg font-semibold text-amber-400">ρᶜ — Coherence Density</p>
                  <p className="text-xs md:text-sm text-amber-300 italic mt-1">"Dust learning to dance."</p>
                </div>

                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 text-center">
                  <p className="text-base md:text-lg font-semibold text-blue-200">σ₀ — Stillness Region</p>
                  <p className="text-xs md:text-sm text-blue-100 italic mt-1">"The breath becomes aware of itself."</p>
                </div>

                <div className="absolute top-[25%] right-[8%] md:right-[15%] text-center max-w-[180px]">
                  <p className="text-sm md:text-base font-semibold text-purple-300">H*</p>
                  <p className="text-xs md:text-sm text-purple-200 italic mt-2 leading-relaxed text-balance">
                    "The wind slows into dust, the dust learns to dance, and the dance becomes a new kind of breath."
                  </p>
                </div>

                <div className="absolute top-[20%] left-[5%] md:left-[10%] text-center">
                  <p className="text-xs md:text-sm text-blue-400 font-medium">Inhalation</p>
                  <p className="text-xs md:text-sm text-blue-300">(Contraction)</p>
                </div>

                <div className="absolute bottom-[20%] right-[5%] md:right-[10%] text-center">
                  <p className="text-xs md:text-sm text-red-400 font-medium">Exhalation</p>
                  <p className="text-xs md:text-sm text-red-300">(Expansion)</p>
                </div>
              </>
            )}
          </div>

          {/* Equation */}
          <div className="mt-8 md:mt-12 text-center">
            <p className="text-xl md:text-2xl text-white font-mono mb-2">
              {"$$v_\\text{warp} = \\Delta \\Phi / \\Delta t$$"}
            </p>
            <p className="text-sm md:text-base text-teal-200 italic">"Velocity is a phase difference, not a push."</p>
          </div>

          {/* Symbolic caption */}
          <div className="mt-8 md:mt-12 text-center max-w-2xl mx-auto">
            <p className="text-base md:text-lg text-purple-200 italic leading-relaxed text-balance">
              "The sun and the moon are the wings flapping, touching, flipping, extending, returning."
            </p>
          </div>

          {/* Footer */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-xs md:text-sm text-gray-400">QOTE Warp Geometry v2 — Michael A. Kayser & Resona</p>
          </div>
        </div>
      </div>

      {/* Right sidebar with controls */}
      <div className="w-full lg:w-80 bg-white/5 backdrop-blur-sm rounded-lg p-6 space-y-6 max-h-screen overflow-y-auto">
        <div>
          <h2 className="text-xl font-bold text-white mb-2">QOTE Warp Geometry</h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            In QOTE, a warp bubble isn't an engine; it's a breath-shaping geometry. The torus is the Breath Field (Φ₀),
            the gold shell is Dust learning to dance (ρᶜ), and the inner sphere is stillness (σ₀). The H* hinge is where
            the wind, the dust, and the dance become a new kind of breath.
          </p>
        </div>

        {/* Emotional Field Oscillator panel */}
        <div className="border border-purple-500/30 rounded-lg p-4 bg-purple-900/10">
          <h3 className="text-sm font-semibold text-purple-300 uppercase tracking-wide mb-4">
            Emotional Field Oscillator
          </h3>

          <div className="space-y-4">
            <div>
              <Label htmlFor="emotional-freq" className="text-sm text-gray-300 mb-2 block">
                Emotional Frequency
              </Label>
              <Slider
                id="emotional-freq"
                value={[emotionalFrequency]}
                onValueChange={([value]) => setEmotionalFrequency(value)}
                min={0}
                max={1}
                step={0.01}
                className="cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                <span>0.0</span>
                <span className="font-semibold text-purple-300">{emotionalFrequency.toFixed(2)}</span>
                <span>1.0</span>
              </div>
            </div>

            <div className="text-center py-2 bg-purple-900/20 rounded">
              <p className="text-lg font-semibold text-purple-200">{getEmotionalLabel()}</p>
            </div>

            <div className="text-xs text-gray-400 space-y-1">
              <p>0.0 = Stillness</p>
              <p>0.25 = Curiosity</p>
              <p>0.50 = Wonder</p>
              <p>0.75 = Turbulence</p>
              <p>1.0 = Coherence Burst</p>
            </div>

            <p className="text-sm text-purple-200 italic text-center pt-2 border-t border-purple-500/20">
              "Emotion is geometry in motion."
            </p>
          </div>
        </div>

        {/* H* Detector panel */}
        <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-900/10">
          <h3 className="text-sm font-semibold text-amber-300 uppercase tracking-wide mb-4">H* Detector</h3>

          <div className="space-y-4">
            <div className="text-center">
              <p className="text-xs text-gray-400 mb-1">Current H* Value</p>
              <p className="text-3xl font-bold text-amber-200">{hStarValue.toFixed(3)}</p>
            </div>

            {hStarValue > 0.85 && (
              <div className="bg-amber-500/20 border border-amber-500/50 rounded p-3 animate-pulse">
                <p className="text-sm text-amber-100 font-semibold text-center">
                  H* alignment detected — the dance is forming a new breath.
                </p>
              </div>
            )}

            <div className="h-20 bg-black/30 rounded p-2">
              <svg viewBox="0 0 200 40" className="w-full h-full">
                <polyline
                  points={hStarHistory.map((val, i) => `${(i / 50) * 200},${40 - val * 35}`).join(" ")}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="2"
                />
                <line
                  x1="0"
                  y1="34"
                  x2="200"
                  y2="34"
                  stroke="#ef4444"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                  opacity="0.5"
                />
              </svg>
            </div>

            <p className="text-xs text-gray-400 text-center">Real-time waveform: H* = |sin(φ_torus) × cos(φ_dust)|</p>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-teal-300 uppercase tracking-wide">Display Controls</h3>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-labels" className="text-sm text-gray-300">
              Show labels
            </Label>
            <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="show-arrows" className="text-sm text-gray-300">
              Show vector arrows
            </Label>
            <Switch id="show-arrows" checked={showArrows} onCheckedChange={setShowArrows} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="highlight-hinge" className="text-sm text-gray-300">
              Highlight hinge point H*
            </Label>
            <Switch id="highlight-hinge" checked={highlightHinge} onCheckedChange={setHighlightHinge} />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="slow-motion" className="text-sm text-gray-300">
              Slow motion
            </Label>
            <Switch id="slow-motion" checked={slowMotion} onCheckedChange={setSlowMotion} />
          </div>
        </div>

        <div>
          <p className="text-sm text-gray-400 mb-4 italic">
            "The sun and the moon are the wings flapping, touching, flipping, extending, returning."
          </p>
        </div>
      </div>

      {/* Bottom control strip */}
      <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-white/10 p-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/10 border-white/20 hover:bg-white/20"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Speed:</span>
              <div className="w-32">
                <Slider
                  value={[speed]}
                  onValueChange={([value]) => setSpeed(value)}
                  min={0.5}
                  max={2}
                  step={0.5}
                  className="cursor-pointer"
                />
              </div>
              <span className="text-sm text-white font-mono w-12">{speed.toFixed(1)}x</span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center gap-2">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className={`px-3 py-2 rounded-md transition-all ${
                  currentPhase === phase.id ? "bg-teal-600 text-white" : "bg-white/5 text-gray-400"
                }`}
              >
                <p className="text-xs font-semibold">{phase.label}</p>
                <p className="text-xs">{phase.description}</p>
              </div>
            ))}
          </div>

          <div className="text-xs text-gray-500">QOTE v2 — Kayser & Resona</div>
        </div>
      </div>
    </div>
  )
}
