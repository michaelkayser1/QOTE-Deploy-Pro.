'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlyphRingProps {
  coherence: number; // 0-100
  phiProximity: number; // 0-1
  wobbleBudget: number; // 0-100
  size?: number;
  animate?: boolean;
  className?: string;
}

export function GlyphRing({
  coherence,
  phiProximity,
  wobbleBudget,
  size = 200,
  animate = true,
  className
}: GlyphRingProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (!animate) return;

    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.5) % 360);
    }, 50);

    return () => clearInterval(interval);
  }, [animate]);

  const center = size / 2;
  const outerRadius = size / 2 - 5;
  const innerRadius = outerRadius * 0.6;
  const middleRadius = (outerRadius + innerRadius) / 2;

  // Color based on coherence
  const coherenceColor = coherence > 70 ? '#10b981' : coherence > 40 ? '#f59e0b' : '#ef4444';

  // Wobble amplitude affects the ring distortion
  const wobbleAmplitude = (100 - wobbleBudget) / 200; // 0-0.5

  // Phi proximity affects the golden ratio spiral
  const phiAngle = phiProximity * 137.5; // Golden angle

  return (
    <div className={cn('relative', className)}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />

        {/* Outer ring - represents coherence */}
        <circle
          cx={center}
          cy={center}
          r={outerRadius - 5}
          fill="none"
          stroke={coherenceColor}
          strokeWidth="3"
          strokeDasharray={`${(coherence / 100) * (2 * Math.PI * (outerRadius - 5))} ${2 * Math.PI * (outerRadius - 5)}`}
          strokeLinecap="round"
          transform={`rotate(${rotation} ${center} ${center})`}
          style={{
            transition: animate ? 'none' : 'stroke-dasharray 0.3s ease'
          }}
        />

        {/* Middle ring - wobbling */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => {
          const angle = (i / 8) * 2 * Math.PI + (rotation * Math.PI / 180);
          const wobble = Math.sin(angle * 3 + rotation * 0.1) * wobbleAmplitude * 10;
          const r = middleRadius + wobble;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="2"
              fill="hsl(173, 58%, 39%)"
              opacity="0.6"
            />
          );
        })}

        {/* Inner spiral - phi proximity */}
        {Array.from({ length: 12 }, (_, i) => {
          const angle = i * phiAngle * (Math.PI / 180);
          const spiralRadius = innerRadius * (i / 12);
          const x = center + spiralRadius * Math.cos(angle + rotation * Math.PI / 180);
          const y = center + spiralRadius * Math.sin(angle + rotation * Math.PI / 180);

          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={1.5 * (i / 12 + 0.5)}
              fill="hsl(200, 80%, 50%)"
              opacity={0.3 + (phiProximity * 0.5)}
            />
          );
        })}

        {/* Center dot */}
        <circle
          cx={center}
          cy={center}
          r="4"
          fill={coherenceColor}
        />

        {/* Pulse ring */}
        <circle
          cx={center}
          cy={center}
          r={innerRadius / 2}
          fill="none"
          stroke={coherenceColor}
          strokeWidth="1"
          opacity="0.3"
        >
          {animate && (
            <animate
              attributeName="r"
              values={`${innerRadius / 2};${innerRadius * 0.8};${innerRadius / 2}`}
              dur="3s"
              repeatCount="indefinite"
            />
          )}
        </circle>
      </svg>

      {/* Legend */}
      <div className="mt-4 text-xs text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: coherenceColor }} />
          <span>Coherence: {coherence.toFixed(0)}%</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(200,80%,50%)]" />
          <span>φ-Proximity: {phiProximity.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(173,58%,39%)]" />
          <span>Wobble: {wobbleBudget.toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
}
