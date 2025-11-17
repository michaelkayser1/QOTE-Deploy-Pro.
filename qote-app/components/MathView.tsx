'use client';

import { useState } from 'react';
import { Tree, computeCoproduct, computeAntipode, CoproductTerm } from '@/lib/hopf';
import TreeRenderer from './TreeRenderer';
import ForestRenderer from './ForestRenderer';

type Tab = 'coproduct' | 'product' | 'antipode';

interface MathViewProps {
  currentTree: Tree | null;
  treeA: Tree | null;
  treeB: Tree | null;
  onSelectCoproductTerm?: (term: CoproductTerm) => void;
  onSelectAntipode?: () => void;
}

export default function MathView({
  currentTree,
  treeA,
  treeB,
  onSelectCoproductTerm,
  onSelectAntipode,
}: MathViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>('coproduct');

  const tabs: { id: Tab; label: string; symbol: string }[] = [
    { id: 'coproduct', label: 'Coproduct', symbol: 'Δ' },
    { id: 'product', label: 'Product', symbol: '·' },
    { id: 'antipode', label: 'Antipode', symbol: 'S' },
  ];

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900/30 border-r border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-primary">Math View</h2>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 rounded-lg font-semibold transition
              ${
                activeTab === tab.id
                  ? 'bg-primary text-black'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }
            `}
          >
            {tab.label} <span className="font-mono">{tab.symbol}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'coproduct' && (
          <CoproductView tree={currentTree} onSelectTerm={onSelectCoproductTerm} />
        )}
        {activeTab === 'product' && <ProductView treeA={treeA} treeB={treeB} />}
        {activeTab === 'antipode' && (
          <AntipodeView tree={currentTree} onSelectAntipode={onSelectAntipode} />
        )}
      </div>
    </div>
  );
}

function CoproductView({
  tree,
  onSelectTerm,
}: {
  tree: Tree | null;
  onSelectTerm?: (term: CoproductTerm) => void;
}) {
  if (!tree) {
    return (
      <div className="text-gray-500 text-center py-12">
        Build or select a tree first.
      </div>
    );
  }

  const terms = computeCoproduct(tree);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded mb-4">
        <div className="font-mono mb-2">Δ(T) = T ⊗ 1 + 1 ⊗ T + Σ (top forest) ⊗ (bottom tree)</div>
        <p className="text-xs text-gray-400">
          We cut one edge at a time. The 'top forest' are excursions; the 'bottom tree' is the spine
          that stays attached to the root.
        </p>
      </div>

      <div className="space-y-4">
        {terms.map((term, i) => (
          <div
            key={term.id}
            className="border border-gray-700 rounded-lg p-4 bg-gray-900/50 hover:bg-gray-900/70 hover:border-primary/50 transition cursor-pointer"
            onClick={() => onSelectTerm?.(term)}
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              {/* Top forest */}
              <div className="flex-1 flex justify-center">
                <ForestRenderer forest={term.topForest} width={150} height={120} />
              </div>

              {/* Tensor product symbol */}
              <div className="text-2xl font-bold text-gray-500">⊗</div>

              {/* Bottom tree */}
              <div className="flex-1 flex justify-center">
                {term.bottomTree ? (
                  <TreeRenderer tree={term.bottomTree} width={150} height={120} />
                ) : (
                  <div className="text-gray-500 text-lg font-mono">1</div>
                )}
              </div>
            </div>

            <p className="text-xs text-gray-400 text-center mt-2">{term.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProductView({ treeA, treeB }: { treeA: Tree | null; treeB: Tree | null }) {
  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded mb-4">
        <p className="text-xs text-gray-400">
          Multiplication of trees simply places them side by side: a forest. In QOTE, this is
          'parallel oscillators sharing the same field'.
        </p>
      </div>

      <div className="text-center text-gray-400 text-sm mb-4">
        Tree A · Tree B = Forest [A, B]
      </div>

      <div className="flex items-center justify-center gap-6">
        {/* Tree A */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-2">Tree A</div>
          {treeA ? (
            <TreeRenderer tree={treeA} width={150} height={150} />
          ) : (
            <div className="w-[150px] h-[150px] border border-gray-700 rounded bg-gray-900/30 flex items-center justify-center text-gray-500">
              None
            </div>
          )}
        </div>

        {/* Multiplication symbol */}
        <div className="text-3xl font-bold text-gray-500">·</div>

        {/* Tree B */}
        <div className="flex flex-col items-center">
          <div className="text-xs text-gray-500 mb-2">Tree B</div>
          {treeB ? (
            <TreeRenderer tree={treeB} width={150} height={150} />
          ) : (
            <div className="w-[150px] h-[150px] border border-gray-700 rounded bg-gray-900/30 flex items-center justify-center text-gray-500">
              None
            </div>
          )}
        </div>
      </div>

      {/* Result */}
      {treeA && treeB && (
        <div className="mt-6 pt-6 border-t border-gray-800">
          <div className="text-xs text-gray-500 mb-2 text-center">Product Forest</div>
          <div className="flex justify-center">
            <ForestRenderer forest={[treeA, treeB]} width={400} height={150} />
          </div>
        </div>
      )}

      {(!treeA || !treeB) && (
        <div className="text-gray-500 text-sm text-center mt-8">
          Use the Tree Builder to create two trees for multiplication (toggle between Tree A and Tree
          B mode)
        </div>
      )}
    </div>
  );
}

function AntipodeView({
  tree,
  onSelectAntipode,
}: {
  tree: Tree | null;
  onSelectAntipode?: () => void;
}) {
  if (!tree) {
    return (
      <div className="text-gray-500 text-center py-12">
        Build or select a tree first.
      </div>
    );
  }

  const antipode = computeAntipode(tree);

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-300 bg-gray-800/50 p-3 rounded mb-4">
        <p className="text-xs text-gray-400">
          The antipode behaves like an algebraic inverse. Here we show a simplified antipode: the
          tree mirrored through the root with an overall sign.
        </p>
      </div>

      <div
        className="border border-gray-700 rounded-lg p-6 bg-gray-900/50 hover:bg-gray-900/70 hover:border-secondary/50 transition cursor-pointer"
        onClick={() => onSelectAntipode?.()}
      >
        <div className="flex items-center justify-center gap-8">
          {/* Original tree */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-2">Original T</div>
            <TreeRenderer tree={tree} width={180} height={180} />
          </div>

          {/* Arrow */}
          <div className="text-3xl font-bold text-gray-500">⟼</div>

          {/* Antipode result */}
          <div className="flex flex-col items-center">
            <div className="text-xs text-gray-500 mb-2">S(T)</div>
            <div className="relative">
              <TreeRenderer tree={antipode.tree} width={180} height={180} />
              <div
                className={`absolute -top-6 left-1/2 -translate-x-1/2 text-lg font-bold ${
                  antipode.sign === 1 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {antipode.sign === 1 ? '+' : '−'}
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 text-center mt-4">{antipode.explanation}</p>
      </div>
    </div>
  );
}
