import { Forest } from '@/lib/hopf';
import TreeRenderer from './TreeRenderer';

interface ForestRendererProps {
  forest: Forest;
  width?: number;
  height?: number;
  label?: string;
}

export default function ForestRenderer({
  forest,
  width = 300,
  height = 150,
  label,
}: ForestRendererProps) {
  if (forest.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center" style={{ width, height }}>
        <div className="text-gray-500 text-sm">
          {label || '∅'} (empty)
        </div>
      </div>
    );
  }

  const treeWidth = Math.min(width / forest.length - 10, 200);

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <div className="text-xs text-gray-400 font-mono">{label}</div>}
      <div className="flex gap-2 items-center justify-center">
        {forest.map((tree, i) => (
          <div key={`${tree.id}-${i}`} className="flex flex-col items-center">
            <TreeRenderer tree={tree} width={treeWidth} height={height} highlightRoot={false} />
          </div>
        ))}
      </div>
    </div>
  );
}
