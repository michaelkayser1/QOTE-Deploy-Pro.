import { Tree, computeTreeLayout } from '@/lib/hopf';

interface TreeRendererProps {
  tree: Tree | null;
  width?: number;
  height?: number;
  selectedNode?: string | null;
  onNodeClick?: (nodeId: string) => void;
  highlightRoot?: boolean;
}

export default function TreeRenderer({
  tree,
  width = 300,
  height = 250,
  selectedNode = null,
  onNodeClick,
  highlightRoot = true,
}: TreeRendererProps) {
  if (!tree || tree.nodes.length === 0) {
    return (
      <svg width={width} height={height} className="border border-gray-700 rounded bg-gray-900/30">
        <text x={width / 2} y={height / 2} textAnchor="middle" className="fill-gray-500 text-sm">
          Empty
        </text>
      </svg>
    );
  }

  const layout = computeTreeLayout(tree, width - 40, height - 40);
  const nodeRadius = 8;

  return (
    <svg width={width} height={height} className="border border-gray-700 rounded bg-gray-900/30">
      <g transform="translate(20, 20)">
        {/* Render edges */}
        {tree.edges.map((edge, i) => {
          const fromPos = layout.get(edge.from);
          const toPos = layout.get(edge.to);
          if (!fromPos || !toPos) return null;

          return (
            <line
              key={`edge-${i}`}
              x1={fromPos.x}
              y1={fromPos.y}
              x2={toPos.x}
              y2={toPos.y}
              className="stroke-gray-600"
              strokeWidth="2"
            />
          );
        })}

        {/* Render nodes */}
        {tree.nodes.map((nodeId) => {
          const pos = layout.get(nodeId);
          if (!pos) return null;

          const isRoot = nodeId === tree.root;
          const isSelected = nodeId === selectedNode;

          return (
            <g key={nodeId}>
              {/* Selection glow */}
              {isSelected && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 4}
                  className="fill-primary/30 animate-pulse"
                />
              )}

              {/* Root ring */}
              {isRoot && highlightRoot && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 3}
                  className="fill-none stroke-warning stroke-2"
                />
              )}

              {/* Node circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                className={`
                  ${isSelected ? 'fill-primary' : 'fill-gray-300'}
                  ${onNodeClick ? 'cursor-pointer hover:fill-accent' : ''}
                  transition-colors
                `}
                onClick={() => onNodeClick?.(nodeId)}
              />

              {/* Node label */}
              <text
                x={pos.x}
                y={pos.y - nodeRadius - 5}
                textAnchor="middle"
                className="fill-gray-400 text-xs font-mono pointer-events-none"
              >
                {nodeId}
              </text>
            </g>
          );
        })}
      </g>
    </svg>
  );
}
