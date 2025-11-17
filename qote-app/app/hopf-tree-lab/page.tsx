'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Tree, CoproductTerm } from '@/lib/hopf';
import TreeBuilder from '@/components/TreeBuilder';
import MathView from '@/components/MathView';
import QOTEInterpretation from '@/components/QOTEInterpretation';

type InterpretationMode = 'math' | 'qote';
type ViewType = 'default' | 'coproduct' | 'product' | 'antipode';

export default function HopfTreeLab() {
  const [currentTree, setCurrentTree] = useState<Tree | null>(null);
  const [treeA, setTreeA] = useState<Tree | null>(null);
  const [treeB, setTreeB] = useState<Tree | null>(null);
  const [mode, setMode] = useState<InterpretationMode>('qote');
  const [viewType, setViewType] = useState<ViewType>('default');
  const [selectedCoproductTerm, setSelectedCoproductTerm] = useState<CoproductTerm | null>(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleTreeChange = (tree: Tree | null) => {
    setCurrentTree(tree);
    setTreeA(tree);
    setViewType('default');
    setSelectedCoproductTerm(null);
  };

  const handleSelectCoproductTerm = (term: CoproductTerm) => {
    setViewType('coproduct');
    setSelectedCoproductTerm(term);
  };

  const handleSelectAntipode = () => {
    setViewType('antipode');
    setSelectedCoproductTerm(null);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-warning via-primary to-secondary bg-clip-text text-transparent">
                QOTE–Hopf Tree Lab
              </h1>
              <p className="text-sm text-gray-400">
                Rooted trees, Hopf algebra, and QOTE resonance
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mode toggle */}
              <div className="flex gap-2 bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setMode('math')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition ${
                    mode === 'math'
                      ? 'bg-primary text-black'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  Math mode
                </button>
                <button
                  onClick={() => setMode('qote')}
                  className={`px-4 py-2 rounded text-sm font-semibold transition ${
                    mode === 'qote'
                      ? 'bg-secondary text-black'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  QOTE mode
                </button>
              </div>

              {/* Info button */}
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-gray-200 transition"
                title="Help"
              >
                <span className="text-sm font-bold">i</span>
              </button>

              {/* Home link */}
              <Link
                href="/"
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition text-sm"
              >
                ← Home
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Info panel */}
      {showInfo && (
        <div className="bg-gray-900/95 border-b border-gray-800 px-6 py-4">
          <div className="max-w-[1800px] mx-auto">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h3 className="text-warning font-bold mb-2">What is a Hopf algebra?</h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  A Hopf algebra is an algebraic structure with both multiplication (combining
                  objects) and comultiplication (splitting objects). It's used to study symmetries,
                  quantum groups, and—in our case—rooted trees as combinatorial objects.
                </p>
              </div>
              <div>
                <h3 className="text-secondary font-bold mb-2">
                  What is QOTE's devolution/evolution split?
                </h3>
                <p className="text-gray-400 text-xs leading-relaxed">
                  In QOTE theory, identity is a stable oscillation pattern (the "neutrino soul
                  path"). Trauma or learning events create temporary branches (devolution), which
                  later reintegrate (evolution). The coproduct Δ mathematically models these splits.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main three-panel layout */}
      <main className="max-w-[1800px] mx-auto">
        {/* Desktop: three columns */}
        <div className="hidden lg:grid lg:grid-cols-[30%_40%_30%] h-[calc(100vh-120px)]">
          <TreeBuilder currentTree={currentTree} onTreeChange={handleTreeChange} />
          <MathView
            currentTree={currentTree}
            treeA={treeA}
            treeB={treeB}
            onSelectCoproductTerm={handleSelectCoproductTerm}
            onSelectAntipode={handleSelectAntipode}
          />
          <QOTEInterpretation
            mode={mode}
            viewType={viewType}
            coproductTerm={selectedCoproductTerm}
            tree={currentTree}
          />
        </div>

        {/* Mobile/Tablet: stacked */}
        <div className="lg:hidden">
          <div className="border-b border-gray-800">
            <div className="sticky top-[73px] bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2 z-40">
              <h2 className="text-lg font-bold text-warning">Tree Builder</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <TreeBuilder currentTree={currentTree} onTreeChange={handleTreeChange} />
            </div>
          </div>

          <div className="border-b border-gray-800">
            <div className="sticky top-[73px] bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2 z-40">
              <h2 className="text-lg font-bold text-primary">Math View</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <MathView
                currentTree={currentTree}
                treeA={treeA}
                treeB={treeB}
                onSelectCoproductTerm={handleSelectCoproductTerm}
                onSelectAntipode={handleSelectAntipode}
              />
            </div>
          </div>

          <div className="border-b border-gray-800">
            <div className="sticky top-[73px] bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 px-4 py-2 z-40">
              <h2 className="text-lg font-bold text-secondary">QOTE Interpretation</h2>
            </div>
            <div className="max-h-[600px] overflow-y-auto">
              <QOTEInterpretation
                mode={mode}
                viewType={viewType}
                coproductTerm={selectedCoproductTerm}
                tree={currentTree}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
