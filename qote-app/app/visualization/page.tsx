'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export default function VisualizationPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [deltaThetaTotal, setDeltaThetaTotal] = useState(0);
  const [currentDeltaTheta, setCurrentDeltaTheta] = useState(0);
  const [phase, setPhase] = useState(0);
  const [status, setStatus] = useState<'safe' | 'caution' | 'danger'>('safe');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    // Constants
    const DELTA_SAFE = Math.PI;
    const DELTA_MAX = 2 * Math.PI;
    const TAU = 1.0;

    // Particle class
    class Particle {
      x: number;
      y: number;
      vx: number = 0;
      vy: number = 0;
      phase: number;
      radius: number = 4;
      trail: Array<{ x: number; y: number }> = [];
      maxTrail: number = 50;
      type: 'prove' | 'evolve' | 'refine' | 'generate';

      constructor(x: number, y: number, type: 'prove' | 'evolve' | 'refine' | 'generate') {
        this.x = x;
        this.y = y;
        this.type = type;
        this.phase = Math.random() * Math.PI * 2;
      }

      update(centerX: number, centerY: number, coherenceFactor: number) {
        const freq = this.type === 'prove' ? 0.02 :
                     this.type === 'evolve' ? 0.04 :
                     this.type === 'refine' ? 0.03 : 0.05;

        this.phase += freq;

        const amplitude = 100 * (1 - coherenceFactor);

        const targetX = centerX + Math.cos(this.phase) * amplitude;
        const targetY = centerY + Math.sin(this.phase) * amplitude;

        this.vx += (targetX - this.x) * 0.01;
        this.vy += (targetY - this.y) * 0.01;

        this.vx *= 0.95;
        this.vy *= 0.95;

        this.x += this.vx;
        this.y += this.vy;

        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrail) {
          this.trail.shift();
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        const color = this.getColor();

        // Draw trail
        if (this.trail.length > 1) {
          ctx.strokeStyle = color;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(this.trail[0].x, this.trail[0].y);
          for (let i = 1; i < this.trail.length; i++) {
            ctx.globalAlpha = 0.3 * (i / this.trail.length);
            ctx.lineTo(this.trail[i].x, this.trail[i].y);
          }
          ctx.stroke();
        }

        // Draw particle
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Glow
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, color + '66');
        gradient.addColorStop(1, color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      getColor() {
        switch (this.type) {
          case 'prove': return '#00d9ff';
          case 'evolve': return '#ff00ff';
          case 'refine': return '#00ff88';
          case 'generate': return '#ffc800';
        }
      }
    }

    // Initialize particles
    const particles: Particle[] = [];
    const types: Array<'prove' | 'evolve' | 'refine' | 'generate'> = ['prove', 'evolve', 'refine', 'generate'];

    const initParticles = () => {
      particles.length = 0;
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2;
        const radius = 150;
        const x = canvas.width / 2 + Math.cos(angle) * radius;
        const y = canvas.height / 2 + Math.sin(angle) * radius;
        const type = types[i % 4];
        particles.push(new Particle(x, y, type));
      }
    };
    initParticles();

    // Animation state
    let time = 0;
    let localDeltaTotal = 0;
    let localPhase = 0;
    let animationId: number;

    // Draw coherence band
    const drawCoherenceBand = (centerX: number, centerY: number) => {
      // Safe zone
      ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 80, 0, Math.PI * 2);
      ctx.stroke();

      // Caution zone
      ctx.strokeStyle = 'rgba(255, 200, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 140, 0, Math.PI * 2);
      ctx.stroke();

      // Danger zone
      ctx.strokeStyle = 'rgba(255, 60, 60, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 200, 0, Math.PI * 2);
      ctx.stroke();
    };

    // Animation loop
    const animate = () => {
      // Clear with trail effect
      ctx.fillStyle = 'rgba(10, 10, 15, 0.2)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // Draw coherence band
      drawCoherenceBand(centerX, centerY);

      // Draw center point
      ctx.fillStyle = '#00d9ff';
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing center
      const pulse = Math.sin(time * 0.05) * 0.3 + 0.7;
      const gradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 30 * pulse
      );
      gradient.addColorStop(0, '#00d9ff88');
      gradient.addColorStop(1, '#00d9ff00');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Update phase
      time += 0.016;
      localPhase += 0.02;

      // Simulate Δθ accumulation
      const deltaTheta = Math.abs(Math.sin(time * 0.1)) * 0.05;
      localDeltaTotal += deltaTheta;

      // Calculate coherence factor
      const coherenceFactor = Math.min(1, localDeltaTotal / (DELTA_MAX * 1.5));

      // Update particles
      particles.forEach(p => {
        p.update(centerX, centerY, coherenceFactor);
        p.draw(ctx);
      });

      // Draw connections
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.globalAlpha = (1 - dist / 100) * 0.3;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;

      // Update React state
      setDeltaThetaTotal(localDeltaTotal);
      setCurrentDeltaTheta(deltaTheta);
      setPhase(localPhase);

      // Update status
      if (localDeltaTotal < DELTA_SAFE) {
        setStatus('safe');
      } else if (localDeltaTotal < DELTA_MAX) {
        setStatus('caution');
      } else {
        setStatus('danger');
      }

      // Reset if too high
      if (localDeltaTotal > DELTA_MAX * 2) {
        localDeltaTotal *= 0.5;
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleReset = () => {
    setDeltaThetaTotal(0);
    setCurrentDeltaTheta(0);
    setPhase(0);
    setStatus('safe');
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-primary font-bold text-xl tracking-wider">
              QOTE × ALPHAEVOLVE × RESONA
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition">
                Home
              </Link>
              <Link href="/docs" className="text-foreground hover:text-primary transition">
                Docs
              </Link>
              <Link href="/visualization" className="text-primary transition">
                Visualization
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="text-center py-6 bg-gray-900/30 border-b border-gray-800">
        <h1 className="text-3xl font-bold text-primary mb-2">Interactive Visualization</h1>
        <p className="text-gray-400 text-sm">Watch discovery breathe in real-time</p>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Controls */}
        <div className="absolute top-4 right-4 bg-gray-900/90 border border-gray-800 rounded-lg p-4 backdrop-blur-sm min-w-[250px]">
          <div className="text-primary font-bold mb-3 text-sm">COHERENCE METRICS</div>

          <div className="space-y-2 text-xs mb-4">
            <div className="flex justify-between">
              <span>Δθ_total:</span>
              <span className="text-accent font-mono">{deltaThetaTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Current Δθ:</span>
              <span className="text-accent font-mono">{currentDeltaTheta.toFixed(3)}</span>
            </div>
            <div className="flex justify-between">
              <span>Rhythm τ:</span>
              <span className="text-accent font-mono">1.00s</span>
            </div>
            <div className="flex justify-between">
              <span>Phase ψ:</span>
              <span className="text-accent font-mono">{Math.floor((phase % (2 * Math.PI)) * 180 / Math.PI)}°</span>
            </div>
          </div>

          <div
            className={`text-center font-bold py-2 px-4 rounded text-sm mb-3 ${
              status === 'safe'
                ? 'bg-green-900/30 text-green-400 border border-green-500/50'
                : status === 'caution'
                ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-500/50'
                : 'bg-red-900/30 text-red-400 border border-red-500/50'
            }`}
          >
            {status === 'safe' ? 'SAFE ZONE' : status === 'caution' ? 'CAUTION ZONE' : 'DANGER ZONE'}
          </div>

          <button
            onClick={handleReset}
            className="w-full bg-primary text-background font-bold py-2 px-4 rounded text-sm hover:bg-accent transition"
          >
            RESET SIMULATION
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-gray-900/90 border border-gray-800 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-primary font-bold mb-3 text-sm">VISUAL ENCODING</div>
          <div className="space-y-2 text-xs">
            <div className="flex items-center">
              <div className="w-5 h-3 bg-[#00d9ff] rounded mr-2"></div>
              <span>Ψ₀ (Prove/Ground)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-3 bg-[#ff00ff] rounded mr-2"></div>
              <span>Δθ (Evolve/Shift)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-3 bg-[#00ff88] rounded mr-2"></div>
              <span>τ (Refine/Rhythm)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-3 bg-[#ffc800] rounded mr-2"></div>
              <span>∞ (Generate/Recurse)</span>
            </div>
            <div className="flex items-center">
              <div className="w-5 h-3 border border-gray-600 rounded mr-2 bg-gray-800/30"></div>
              <span>Coherence Band</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
