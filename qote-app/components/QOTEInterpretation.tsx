'use client';

import { Tree, CoproductTerm } from '@/lib/hopf';

type InterpretationMode = 'math' | 'qote';
type ViewType = 'default' | 'coproduct' | 'product' | 'antipode';

interface QOTEInterpretationProps {
  mode: InterpretationMode;
  viewType: ViewType;
  coproductTerm?: CoproductTerm | null;
  tree?: Tree | null;
}

export default function QOTEInterpretation({
  mode,
  viewType,
  coproductTerm,
  tree,
}: QOTEInterpretationProps) {
  return (
    <div className="flex flex-col h-full p-4 bg-gray-900/50">
      <h2 className="text-2xl font-bold mb-4 text-secondary">QOTE Interpretation</h2>

      <div className="flex-1 overflow-y-auto space-y-4">
        {viewType === 'coproduct' && coproductTerm && (
          <CoproductInterpretation term={coproductTerm} mode={mode} />
        )}
        {viewType === 'product' && <ProductInterpretation mode={mode} />}
        {viewType === 'antipode' && <AntipodeInterpretation mode={mode} tree={tree} />}
        {viewType === 'default' && <DefaultInterpretation mode={mode} />}
      </div>
    </div>
  );
}

function DefaultInterpretation({ mode }: { mode: InterpretationMode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-warning">Welcome to QOTE–Hopf Tree Lab</h3>

      {mode === 'qote' ? (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            Rooted trees encode journeys through phase space. Each node is a moment in time, each
            edge a transition. The root is your zero-point—the neutrino soul path.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Hopf algebra operations reveal the hidden geometry of oscillations, devolution/evolution
            splits, and identity loops.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Select a math operation from the center panel to see its QOTE interpretation.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            This tool visualizes Hopf algebra operations on rooted trees, including the coproduct
            (Δ), product (·), and antipode (S).
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Build a tree in the left panel, then explore its algebraic structure through the tabs in
            the center panel.
          </p>
        </>
      )}

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">Quick Start</div>
        <ul className="text-sm text-gray-300 space-y-1 list-disc list-inside">
          <li>Create a tree using "Add Y-Tree" or "Add Rooted Chain"</li>
          <li>Click nodes to select them and add children</li>
          <li>Switch between tabs to explore different operations</li>
          <li>Click on results to see detailed QOTE interpretations</li>
        </ul>
      </div>
    </div>
  );
}

function CoproductInterpretation({
  term,
  mode,
}: {
  term: CoproductTerm;
  mode: InterpretationMode;
}) {
  // Compute toy parameters
  const topNodes = term.topForest.reduce((sum, t) => sum + t.nodes.length, 0);
  const bottomNodes = term.bottomTree?.nodes.length || 0;
  const totalNodes = topNodes + bottomNodes || 1;
  const totalEdges = Math.max(totalNodes - 1, 1);
  const cutEdges = term.topForest.length;

  const W = (cutEdges / totalEdges).toFixed(2);
  const deltaTheta = (topNodes / totalNodes).toFixed(2);
  const CI = (1 - topNodes / (totalNodes + 1)).toFixed(2);

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-warning">
        {mode === 'qote'
          ? 'This cut is a devolution/evolution split'
          : 'Coproduct Term Analysis'}
      </h3>

      {mode === 'qote' ? (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            The <span className="text-accent font-semibold">top forest</span> represents excursions
            or trauma/events temporarily detached from the core identity.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The <span className="text-primary font-semibold">bottom tree</span> is the spine that
            stays anchored at the root (zero-point / neutrino soul path).
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            In QOTE, this factorization shows how identity can remain stable while parts of the
            trajectory branch, flip, and later reintegrate.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            The coproduct Δ decomposes a tree into a sum of tensor products. Each term represents a
            different way to cut the tree into a "top forest" and a "bottom tree".
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            This operation is fundamental to understanding the coalgebra structure of rooted trees.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed italic text-gray-400">
            QOTE interpretation: The split reveals oscillation patterns and identity coherence.
          </p>
        </>
      )}

      {/* Resonance parameters */}
      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="text-xs text-gray-400 mb-3">
          {mode === 'qote' ? 'Resonance Snapshot' : 'Computed Parameters'}
        </div>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">
              W {mode === 'qote' && '(cut ratio)'}
            </span>
            <span className="text-primary font-bold">{W}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">
              Δθ {mode === 'qote' && '(phase shift)'}
            </span>
            <span className="text-accent font-bold">{deltaTheta}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">
              CI {mode === 'qote' && '(coherence)'}
            </span>
            <span className={`font-bold ${parseFloat(CI) > 0.6 ? 'text-green-400' : 'text-yellow-400'}`}>
              {CI}
            </span>
          </div>
        </div>
        {mode === 'qote' && (
          <p className="text-xs text-gray-500 mt-3">
            Higher CI = more coherent identity maintenance during the split
          </p>
        )}
      </div>

      {/* Term description */}
      <div className="p-3 bg-black/30 rounded border border-gray-800">
        <div className="text-xs text-gray-500 mb-1">Technical Description</div>
        <p className="text-xs text-gray-400 font-mono">{term.description}</p>
      </div>
    </div>
  );
}

function ProductInterpretation({ mode }: { mode: InterpretationMode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-warning">
        {mode === 'qote' ? 'Parallel oscillators in the same field' : 'Tree Product'}
      </h3>

      {mode === 'qote' ? (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            These two trees represent <span className="text-accent font-semibold">two independent
            journeys</span> running in the same field.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The product doesn't merge them; it arranges them side by side.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            In QOTE, this is <span className="text-primary font-semibold">"multi-line world
            geometry"</span>: multiple oscillators share the same zero-point backdrop while keeping
            distinct identity fractals.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            The product of two trees is simply the forest containing both trees as separate
            components.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            This operation represents the algebra structure: multiplication is disjoint union.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed italic text-gray-400">
            QOTE interpretation: Parallel oscillators maintaining independent coherence.
          </p>
        </>
      )}

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">
          {mode === 'qote' ? 'Field Geometry' : 'Algebraic Property'}
        </div>
        <p className="text-sm text-gray-300">
          {mode === 'qote'
            ? 'Both trees oscillate in the same space, but their identity loops remain separate. This is how consciousness can track multiple narratives simultaneously.'
            : 'The product operation preserves the individual structure of each tree while creating a composite object (forest).'}
        </p>
      </div>
    </div>
  );
}

function AntipodeInterpretation({ mode, tree }: { mode: InterpretationMode; tree?: Tree | null }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-warning">
        {mode === 'qote'
          ? 'Viewing the same path through the zero flip'
          : 'Antipode Operation'}
      </h3>

      {mode === 'qote' ? (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            The antipode <span className="text-secondary font-semibold">mirrors the structure</span>,
            like looking at your life story through the singularity at zero.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            The sign (−1)ⁿ encodes a <span className="text-accent font-semibold">global flip</span>.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            In QOTE, this is how a trajectory looks when you swap "downward descent" for "upward
            ascent" while keeping the identity loop intact.
          </p>
        </>
      ) : (
        <>
          <p className="text-gray-300 text-sm leading-relaxed">
            The antipode S is the "inverse" operation in the Hopf algebra. It satisfies the axiom
            that makes the structure a Hopf algebra.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            This simplified version mirrors the tree structure and applies a sign based on the number
            of nodes.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed italic text-gray-400">
            QOTE interpretation: The journey through the zero-flip frame.
          </p>
        </>
      )}

      <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700">
        <div className="text-xs text-gray-400 mb-2">
          {mode === 'qote' ? 'The Zero-Flip Frame' : 'Mathematical Property'}
        </div>
        <p className="text-sm text-gray-300">
          {mode === 'qote'
            ? 'Every oscillation has a mirror image on the other side of zero. The antipode reveals this symmetry—the same pattern, opposite phase.'
            : 'The antipode provides the "inverse" needed for the Hopf algebra axioms: μ(S ⊗ id)Δ = ε·1.'}
        </p>
      </div>

      {tree && (
        <div className="p-3 bg-black/30 rounded border border-gray-800">
          <div className="text-xs text-gray-500 mb-1">Node Count</div>
          <p className="text-xs text-gray-400 font-mono">
            n = {tree.nodes.length}, sign = (−1)^{tree.nodes.length} ={' '}
            {tree.nodes.length % 2 === 0 ? '+1' : '−1'}
          </p>
        </div>
      )}
    </div>
  );
}
