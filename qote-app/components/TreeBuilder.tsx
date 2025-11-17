'use client';

import { useState } from 'react';
import { Tree, createChain, createYTree, addChild, deleteNode } from '@/lib/hopf';
import TreeRenderer from './TreeRenderer';

interface TreeBuilderProps {
  currentTree: Tree | null;
  onTreeChange: (tree: Tree | null) => void;
}

export default function TreeBuilder({ currentTree, onTreeChange }: TreeBuilderProps) {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [showJSON, setShowJSON] = useState(false);

  const handleAddChain = () => {
    const chain = createChain(3);
    onTreeChange(chain);
    setSelectedNode(null);
  };

  const handleAddYTree = () => {
    const yTree = createYTree();
    onTreeChange(yTree);
    setSelectedNode(null);
  };

  const handleClearTree = () => {
    onTreeChange(null);
    setSelectedNode(null);
  };

  const handleAddChild = () => {
    if (currentTree && selectedNode) {
      const newTree = addChild(currentTree, selectedNode);
      onTreeChange(newTree);
    }
  };

  const handleDeleteNode = () => {
    if (currentTree && selectedNode && selectedNode !== currentTree.root) {
      const newTree = deleteNode(currentTree, selectedNode);
      onTreeChange(newTree);
      setSelectedNode(null);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    setSelectedNode(nodeId === selectedNode ? null : nodeId);
  };

  return (
    <div className="flex flex-col h-full p-4 bg-gray-900/50 border-r border-gray-800">
      <h2 className="text-2xl font-bold mb-4 text-warning">Tree Builder</h2>

      {/* Action buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleAddChain}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition"
        >
          Add Rooted Chain
        </button>
        <button
          onClick={handleAddYTree}
          className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded transition"
        >
          Add Y-Tree
        </button>
        <button
          onClick={handleClearTree}
          className="w-full px-4 py-2 bg-red-900/50 hover:bg-red-900/70 text-gray-200 rounded transition"
        >
          Clear Tree
        </button>
      </div>

      {/* Tree display */}
      <div className="mb-4 flex-shrink-0">
        {currentTree ? (
          <TreeRenderer
            tree={currentTree}
            width={300}
            height={300}
            selectedNode={selectedNode}
            onNodeClick={handleNodeClick}
          />
        ) : (
          <div className="w-[300px] h-[300px] border border-gray-700 rounded bg-gray-900/30 flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center px-4">
              No tree yet—use 'Add Y-Tree' or 'Add Rooted Chain' to start
            </p>
          </div>
        )}
      </div>

      {/* Edit controls */}
      {currentTree && (
        <div className="space-y-2 mb-4">
          <div className="text-sm text-gray-400 mb-2">
            {selectedNode ? `Selected: ${selectedNode}` : 'Click a node to select'}
          </div>
          <button
            onClick={handleAddChild}
            disabled={!selectedNode}
            className="w-full px-4 py-2 bg-primary/20 hover:bg-primary/30 disabled:bg-gray-800 disabled:text-gray-600 text-primary rounded transition"
          >
            Add Child to Selected
          </button>
          <button
            onClick={handleDeleteNode}
            disabled={!selectedNode || selectedNode === currentTree.root}
            className="w-full px-4 py-2 bg-red-900/30 hover:bg-red-900/50 disabled:bg-gray-800 disabled:text-gray-600 text-red-300 rounded transition"
          >
            Delete Selected Node
          </button>
        </div>
      )}

      {/* JSON preview */}
      {currentTree && (
        <div className="mt-auto">
          <button
            onClick={() => setShowJSON(!showJSON)}
            className="text-xs text-gray-500 hover:text-gray-400 mb-2"
          >
            {showJSON ? '▼' : '▶'} JSON Preview
          </button>
          {showJSON && (
            <pre className="text-xs bg-black/30 p-2 rounded overflow-auto max-h-40 text-gray-400 font-mono">
              {JSON.stringify(
                {
                  nodes: currentTree.nodes,
                  edges: currentTree.edges.map(e => [e.from, e.to]),
                },
                null,
                2
              )}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
