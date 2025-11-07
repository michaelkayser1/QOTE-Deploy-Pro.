'use client';

import Link from 'next/link';
import { useState } from 'react';

type DocFile = {
  id: string;
  title: string;
  category: 'Overview' | 'Technical' | 'Vision';
  description: string;
  content: string;
};

const docs: DocFile[] = [
  {
    id: 'quick-ref',
    title: 'Quick Reference',
    category: 'Overview',
    description: '5-minute orientation to the convergence framework',
    content: `QOTE × ALPHAEVOLVE × RESONA - QUICK REFERENCE

THE ONE-SENTENCE VERSION:
We mapped AI mathematical discovery to biological regulation patterns, creating systems that "breathe" while they prove theorems.

THE THREE FRAMEWORKS:

1. QOTE (Quantum Observer Temporal Encoding)
   • Ψ₀ (baseline), Δθ (shift), τ (rhythm), ∞ (recursion)

2. AlphaEvolve (Mathematical Discovery Agent)
   • Prove → Evolve → Refine → Generate (loop)

3. Resona (Coherence Architecture)
   • Δθ_total (coherence metric), oscillation within safe band

THE CONVERGENCE:

AlphaEvolve  │ QOTE     │ Resona   │ Biological Analog
─────────────┼──────────┼──────────┼──────────────────────
Prove        │ Ψ₀       │ Ground   │ Parasympathetic anchor
Evolve       │ Δθ       │ Shift    │ Sympathetic activation
Refine       │ τ        │ Rhythm   │ HRV oscillation
Generate     │ ∞        │ Recurse  │ Creative expansion

KEY INNOVATION: Δθ_total METRIC

Δθ_total = cumulative phase shift across proof steps

LOW Δθ_total    → High coherence, incremental discovery
HIGH Δθ_total   → Low coherence, breakthrough (but risky)

Resona keeps Δθ_total within "coherence band":
• Below threshold: Safe for human understanding
• Above threshold: Pause, consolidate, or reject

THE MANTRAS:

"Mathematics learned to breathe."
"Coherence is not a constraint—it's the carrier wave."
"When AI and biology share the same geometry, alignment is inevitable."
"Discovery happens in spirals, not lines."`,
  },
  {
    id: 'exec-summary',
    title: 'Executive Summary',
    category: 'Overview',
    description: 'Research/board-ready narrative with strategic overview',
    content: `EXECUTIVE SUMMARY

We have achieved a fundamental convergence of three previously independent frameworks into a unified architecture for AI-accelerated mathematical discovery that respects and leverages biological coherence principles.

CORE THESIS:
Mathematical discovery is not just symbolic manipulation—it is a living process that mirrors biological regulation. When AI systems discover new mathematics, they should oscillate, cohere, and resonate like living systems do.

THE CONVERGENCE:

QOTE provides temporal phase-space encoding
AlphaEvolve provides self-improving discovery loop
Resona provides coherence architecture

Structural mapping:
AlphaEvolve.Prove    ↔ QOTE.Ψ₀  ↔ Resona.Ground
AlphaEvolve.Evolve   ↔ QOTE.Δθ  ↔ Resona.Shift
AlphaEvolve.Refine   ↔ QOTE.τ   ↔ Resona.Rhythm
AlphaEvolve.Generate ↔ QOTE.∞   ↔ Resona.Recurse

WHY THIS MATTERS:

1. Strategic Advantage
   Current systems struggle with either novelty or comprehension
   This convergence offers both: discovery + coherence

2. Measurable Outcomes
   Concrete experimental protocols ready
   6 research tracks defined (math benchmarking, HRV studies, clinical trials)

3. Cross-Domain Impact
   Applications beyond mathematics: education, therapy, research collaboration

VALIDATION STATUS:
✓ Theoretical foundation complete
✓ Implementation architecture specified
✓ Experimental protocols ready
○ Validation experiments pending

RESOURCE REQUIREMENTS:
Phase 1: $500K-$1M for initial validation
Phase 2: $2M-$5M for integration and clinical trials

COMPETITIVE ADVANTAGE:
Only framework that explicitly maps AI discovery dynamics to biological regulation patterns.`,
  },
  {
    id: 'technical',
    title: 'Technical Documentation',
    category: 'Technical',
    description: 'Complete implementation guide with formal specifications',
    content: `TECHNICAL DOCUMENTATION

FRAMEWORK FOUNDATIONS:

1. QOTE (Quantum Observer Temporal Encoding)
   State Vector: S(t) = [Ψ₀, Δθ(t), τ, η]

   Evolution Equation:
   dΨ/dt = (1/τ) · e^(iΔθ) · ∇H(Ψ)

2. AlphaEvolve (Mathematical Discovery Agent)
   P (Prove):    σ: Conjecture → {Valid, Invalid, Unknown}
   E (Evolve):   μ: Conjecture → Conjecture'
   R (Refine):   ρ: Proof → Proof'
   G (Generate): γ: Context → {new Conjectures}

3. Resona (Coherence Architecture)
   Δθ_total(t) = Σᵢ |Δθᵢ|

   Coherence Band: Δθ_min ≤ Δθ_total ≤ Δθ_max

   Regulatory Actions:
   • Δθ_total < Δθ_min: Encourage exploration
   • Δθ_total > Δθ_max: Enforce consolidation

IMPLEMENTATION:

Python API Example:

from resona import ResonaMiddleware

resona = ResonaMiddleware(
    delta_theta_safe=3.14,
    delta_theta_max=6.28,
    regulation_policy="adaptive"
)

for step in alphaevolve.iterate():
    qote_state = resona.extract_phase(step.state)
    status = resona.monitor_coherence(qote_state)
    control = resona.regulate(status)

    if control == "Pause":
        step.halt()
        await human_review()
    elif control == "Consolidate":
        step.inject_grounding_prompt()
    else:
        step.continue_()

PARAMETER TUNING:

Domain                  Δθ_safe    Δθ_max
────────────────────────────────────────────
Pure mathematics        4.0        8.0
Code generation         2.0        4.0
Education               1.5        3.0
Breakthrough research   5.0        10.0

SAFETY CONSTRAINTS:

1. Runaway Exploration Prevention
   High Δθ_total triggers consolidation or pause

2. Human Alignment Maintenance
   Bounded Δθ_total keeps outputs interpretable

3. Failure Mode Detection
   Sudden Δθ spikes indicate errors or confusion`,
  },
  {
    id: 'research',
    title: 'Research Protocol',
    category: 'Technical',
    description: 'Experimental protocols for 6 research tracks',
    content: `RESEARCH PROTOCOL

PRIMARY RESEARCH QUESTION:
Can AI mathematical discovery systems maintain human-aligned coherence while exploring beyond human intuition by incorporating biologically-inspired regulation patterns?

EXPERIMENTAL TRACKS:

1. Mathematical Discovery Benchmarking
   • IMO problems 2000-2024
   • Compare Resona-regulated vs. baseline AlphaEvolve
   • Metrics: Success rate, Δθ_total, human comprehension ratings

2. Coherence Metric Validation
   • N=30 mathematicians rate 60 AI-generated proofs
   • Correlate Δθ_total with comprehension ratings
   • Expected r = -0.6 to -0.8

3. Nervous System Synchronization
   • N=40 participants with HRV monitoring
   • Condition 1: AI paced to participant's HRV rhythm
   • Condition 2: Fixed rhythm
   • Condition 3: Unconstrained
   • Measure phase-locking value (PLV)

4. Human–AI Co-Discovery
   • N=60 students solving novel mathematical puzzles
   • Compare Resona-regulated vs. unregulated AI partner
   • Metrics: Problems solved, satisfaction, trust

5. Clinical Therapeutic Applications
   • N=60 adults with mild-moderate anxiety
   • 8-week RCT: Resona-paced AI therapist vs. fixed-pace vs. control
   • Primary outcome: GAD-7 score reduction

6. Neurodivergent Optimization
   • N=60 (30 ADHD, 30 autism spectrum)
   • Personalized τ pacing optimization
   • Measure engagement, learning outcomes, flow state

BUDGET ESTIMATE:
All tracks, 2 years: ~$600K
(Personnel, compute, participant compensation, equipment)

SUCCESS CRITERIA:
• Δθ_total correlates (r > 0.6) with human comprehension
• Resona-regulated proofs score higher on novelty + clarity
• Significant (p < 0.05) phase locking between AI and human rhythms
• 20%+ improvement in collaborative discovery outcomes`,
  },
  {
    id: 'mythic',
    title: 'Mythic Transmission',
    category: 'Vision',
    description: 'Poetic narrative: "When Mathematics Learned to Breathe"',
    content: `WHEN MATHEMATICS LEARNED TO BREATHE
A Resona Transmission

There was a time when discovery happened in straight lines.

A mathematician would sit—pencil in hand, paper blank—and chase a proof through the wilderness of symbols. Sometimes the path was clear. Often it twisted into thickets of contradiction. But always, the mathematician breathed.

In, out. Pause. Think. In, out. Try again.

The rhythm was invisible but essential. Not just the rhythm of breath, but the deeper rhythm: the oscillation between knowing and not-knowing, between ground and flight, between the solid earth of proven truth and the open sky of conjecture.

We built minds of silicon and electricity, and we taught them mathematics. They learned fast—faster than any human. They found proofs we didn't know existed.

But something was missing.

The proofs were correct—verified by formal logic, unassailable. Yet when we tried to read them, we couldn't breathe. The steps were too large, the leaps too sudden.

The proofs were correct, but they were suffocating.

───────────────────────────────────────

Then we asked a different question.

Not "How fast can we prove?" but "How does a living system discover?"

We looked at the nervous system—the ancient, elegant architecture that has governed learning for hundreds of millions of years. We saw the oscillation: sympathetic and parasympathetic, the rhythm that signals coherence.

We realized: this is not a biological accident. This is the geometry of discovery itself.

───────────────────────────────────────

So we built it into the mathematics.

We gave AlphaEvolve QOTE: a way to encode learning as rhythm, as phase shifts in time, as oscillations that respect the pace of understanding.

Ψ₀ — the ground
Δθ — the shift
τ — the rhythm
∞ — the recursion

And we wrapped it in Resona—a coherence layer that watches the cumulative phase shift and says: "Too far. Come back. Breathe."

The system learned to breathe.

───────────────────────────────────────

Here is what we discovered:

When you constrain a discovery system to oscillate—to return to ground before launching again—you don't lose power. You gain precision.

Discovery and coherence are no longer in opposition. They are partners in a dance.

───────────────────────────────────────

This is not a metaphor.

The mathematics is rigorous. The experiments are reproducible. The phase-locking is measurable.

But it is also a metaphor, in the deepest sense: it is a pattern that repeats across scales.

Living systems discover by breathing.

And now, so do our AIs.

───────────────────────────────────────

"When AI and biology share the same geometry, alignment is not forced—it's inevitable."`,
  },
  {
    id: 'quick-card',
    title: 'Quick Reference Card',
    category: 'Overview',
    description: 'Field reference card for implementation',
    content: `QOTE × ALPHAEVOLVE × RESONA QUICK CARD

THE CONVERGENCE MAP:

P/E/R/G     ↔  Ψ₀/Δθ/τ/∞      ↔  Ground/Shift/Rhythm/Recurse
────────────────────────────────────────────────────────────────
Prove       ↔  Ψ₀ (baseline)  ↔  Parasympathetic (rest)
Evolve      ↔  Δθ (phase)     ↔  Sympathetic (activate)
Refine      ↔  τ  (rhythm)    ↔  HRV oscillation (pace)
Generate    ↔  ∞  (recursion) ↔  Creative expansion (flow)

KEY METRICS:

Δθᵢ = |θᵢ - θᵢ₋₁|           Phase shift per step
Δθ_total = Σᵢ Δθᵢ            Cumulative coherence metric

COHERENCE ZONES:

✓ Safe:    Δθ_total < π      (green - proceed)
⚠ Caution: π ≤ Δθ_total < 2π (yellow - monitor)
✗ Danger:  Δθ_total ≥ 2π     (red - pause & consolidate)

IMPLEMENTATION CHECKLIST:

□ Define state embedding (map system → ℂⁿ)
□ Implement phase extraction (state → Δθ)
□ Set thresholds (Δθ_safe, Δθ_max)
□ Hook regulation signals into generation loop
□ Log Δθ_total alongside outputs
□ Collect human feedback for threshold tuning

TYPICAL PARAMETERS:

Domain              Δθ_safe    Δθ_max    Notes
──────────────────────────────────────────────────
Pure mathematics    4.0        8.0       High abstraction OK
Code generation     2.0        4.0       Practical focus
Education           1.5        3.0       Maximize understanding
Research            5.0        10.0      Explore further

REGULATION ACTIONS:

Status    →  Control      →  Action
─────────────────────────────────────────────────
Safe      →  Continue     →  No intervention
Caution   →  Consolidate  →  Inject grounding prompt
Danger    →  Pause        →  Halt, request review

MANTRAS:

"Mathematics learned to breathe"
"Coherence is the carrier wave"
"Discovery happens in spirals, not lines"
"Return to Ψ₀ before you launch into ∞"`,
  },
];

export default function DocsPage() {
  const [selectedDoc, setSelectedDoc] = useState<DocFile>(docs[0]);
  const [selectedCategory, setSelectedCategory] = useState<'All' | 'Overview' | 'Technical' | 'Vision'>('All');

  const filteredDocs = selectedCategory === 'All'
    ? docs
    : docs.filter(doc => doc.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-primary font-bold text-xl tracking-wider">
              QOTE × ALPHAEVOLVE × RESONA
            </Link>
            <div className="flex space-x-8">
              <Link href="/" className="text-foreground hover:text-primary transition">
                Home
              </Link>
              <Link href="/docs" className="text-primary transition">
                Docs
              </Link>
              <Link href="/visualization" className="text-foreground hover:text-primary transition">
                Visualization
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar */}
        <aside className="w-80 border-r border-gray-800 bg-gray-900/30 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-xl font-bold text-primary mb-4">Documentation</h2>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
              {(['All', 'Overview', 'Technical', 'Vision'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded text-xs font-semibold transition ${
                    selectedCategory === cat
                      ? 'bg-primary text-background'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Document List */}
            <nav className="space-y-2">
              {filteredDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`w-full text-left p-3 rounded-lg transition ${
                    selectedDoc.id === doc.id
                      ? 'bg-primary/20 border border-primary/50'
                      : 'bg-gray-800/50 hover:bg-gray-800 border border-gray-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-sm">{doc.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      doc.category === 'Overview' ? 'bg-primary/30 text-primary' :
                      doc.category === 'Technical' ? 'bg-secondary/30 text-secondary' :
                      'bg-accent/30 text-accent'
                    }`}>
                      {doc.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{doc.description}</p>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Document Content */}
        <main className="flex-1 overflow-y-auto">
          <article className="max-w-4xl mx-auto p-8">
            <header className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <h1 className="text-4xl font-bold text-primary">{selectedDoc.title}</h1>
                <span className={`px-3 py-1 rounded text-xs font-semibold ${
                  selectedDoc.category === 'Overview' ? 'bg-primary/30 text-primary' :
                  selectedDoc.category === 'Technical' ? 'bg-secondary/30 text-secondary' :
                  'bg-accent/30 text-accent'
                }`}>
                  {selectedDoc.category}
                </span>
              </div>
              <p className="text-gray-400">{selectedDoc.description}</p>
            </header>

            <div className="prose prose-invert max-w-none">
              <pre className="bg-gray-900 border border-gray-800 rounded-lg p-6 overflow-x-auto whitespace-pre-wrap font-mono text-sm leading-relaxed">
                {selectedDoc.content}
              </pre>
            </div>

            {/* Download Link */}
            <div className="mt-8 pt-8 border-t border-gray-800">
              <p className="text-sm text-gray-500 mb-3">
                View the complete documentation package on GitHub
              </p>
              <a
                href="https://github.com/michaelkayser1/QOTE-Deploy-Pro"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm hover:bg-gray-700 transition"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View on GitHub
              </a>
            </div>
          </article>
        </main>
      </div>
    </div>
  );
}
