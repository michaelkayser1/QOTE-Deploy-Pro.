// Data models for rooted trees and Hopf algebra operations

export type NodeId = string;

export interface Edge {
  from: NodeId; // parent
  to: NodeId;   // child
}

export interface Tree {
  id: string;
  root: NodeId;
  nodes: NodeId[];
  edges: Edge[];
}

export type Forest = Tree[];

export interface CoproductTerm {
  id: string;
  topForest: Forest; // forest above the cut(s)
  bottomTree: Tree | null;  // rooted remainder (null for unit)
  description: string; // short explanation for UI
}

export interface AntipodeResult {
  tree: Tree;          // structurally transformed tree
  sign: 1 | -1;        // overall sign
  explanation: string; // textual explanation
}

export interface TreePosition {
  x: number;
  y: number;
}

export type TreeLayout = Map<NodeId, TreePosition>;

// Helper to check if a tree is valid
export function isValidTree(tree: Tree): boolean {
  if (tree.nodes.length === 0) return false;
  if (!tree.nodes.includes(tree.root)) return false;

  // Check each node has at most one parent
  const parents = new Map<NodeId, NodeId>();
  for (const edge of tree.edges) {
    if (parents.has(edge.to)) {
      return false; // Node has multiple parents
    }
    parents.set(edge.to, edge.from);
  }

  // Root should have no parent
  if (parents.has(tree.root)) return false;

  return true;
}

// Get children of a node
export function getChildren(tree: Tree, nodeId: NodeId): NodeId[] {
  return tree.edges
    .filter(edge => edge.from === nodeId)
    .map(edge => edge.to);
}

// Get parent of a node (or null if root)
export function getParent(tree: Tree, nodeId: NodeId): NodeId | null {
  const edge = tree.edges.find(e => e.to === nodeId);
  return edge ? edge.from : null;
}

// Get all nodes in a subtree rooted at a given node
export function getSubtreeNodes(tree: Tree, rootNodeId: NodeId): Set<NodeId> {
  const nodes = new Set<NodeId>([rootNodeId]);
  const queue = [rootNodeId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    const children = getChildren(tree, current);
    children.forEach(child => {
      nodes.add(child);
      queue.push(child);
    });
  }

  return nodes;
}

// Extract subtree rooted at a given node
export function getSubtree(tree: Tree, rootNodeId: NodeId): Tree {
  const subtreeNodes = getSubtreeNodes(tree, rootNodeId);
  const subtreeEdges = tree.edges.filter(
    edge => subtreeNodes.has(edge.from) && subtreeNodes.has(edge.to)
  );

  return {
    id: `${tree.id}_sub_${rootNodeId}`,
    root: rootNodeId,
    nodes: Array.from(subtreeNodes),
    edges: subtreeEdges,
  };
}

// Remove a subtree from a tree
export function removeSubtree(tree: Tree, rootNodeId: NodeId): Tree {
  const subtreeNodes = getSubtreeNodes(tree, rootNodeId);
  const remainingNodes = tree.nodes.filter(n => !subtreeNodes.has(n));
  const remainingEdges = tree.edges.filter(
    edge => !subtreeNodes.has(edge.from) && !subtreeNodes.has(edge.to)
  );

  return {
    id: `${tree.id}_without_${rootNodeId}`,
    root: tree.root,
    nodes: remainingNodes,
    edges: remainingEdges,
  };
}

// Multiply trees (product is just placing them side by side as a forest)
export function multiplyTrees(a: Tree, b: Tree): Forest {
  return [a, b];
}

// Compute coproduct using admissible one-edge cuts
export function computeCoproduct(tree: Tree): CoproductTerm[] {
  const terms: CoproductTerm[] = [];

  // Trivial term: T ⊗ 1
  terms.push({
    id: `coprod_${tree.id}_T_1`,
    topForest: [tree],
    bottomTree: null, // null represents the unit
    description: "No cut: whole tree ⊗ 1",
  });

  // Trivial term: 1 ⊗ T
  terms.push({
    id: `coprod_${tree.id}_1_T`,
    topForest: [],
    bottomTree: tree,
    description: "No cut: 1 ⊗ whole tree",
  });

  // One-edge cuts
  // For each edge, cut it: the child side becomes top forest, the root side is bottom tree
  for (const edge of tree.edges) {
    const topTree = getSubtree(tree, edge.to);
    const bottomTree = removeSubtree(tree, edge.to);

    const childLabel = edge.to;
    const parentLabel = edge.from;

    terms.push({
      id: `coprod_${tree.id}_cut_${edge.from}_${edge.to}`,
      topForest: [topTree],
      bottomTree: bottomTree.nodes.length > 0 ? bottomTree : null,
      description: `Cut edge ${parentLabel}→${childLabel}: excursion subtree rooted at ${childLabel} ⊗ remaining spine`,
    });
  }

  return terms;
}

// Compute antipode (simplified version)
export function computeAntipode(tree: Tree): AntipodeResult {
  // Simple antipode: mirror the tree by reversing edges
  // This is a toy implementation for illustration

  // Get depth of each node
  const depths = new Map<NodeId, number>();
  const computeDepth = (nodeId: NodeId): number => {
    if (depths.has(nodeId)) return depths.get(nodeId)!;
    const parent = getParent(tree, nodeId);
    const depth = parent ? computeDepth(parent) + 1 : 0;
    depths.set(nodeId, depth);
    return depth;
  };

  tree.nodes.forEach(node => computeDepth(node));

  const maxDepth = Math.max(...Array.from(depths.values()));

  // Mirror by swapping levels
  const mirroredEdges: Edge[] = tree.edges.map(edge => ({
    from: edge.to,  // Reverse the direction
    to: edge.from,
  }));

  // Find new root (what was the deepest becomes the root)
  const deepestNodes = tree.nodes.filter(n => depths.get(n) === maxDepth);
  const newRoot = deepestNodes[0] || tree.root;

  const mirroredTree: Tree = {
    id: `antipode_${tree.id}`,
    root: newRoot,
    nodes: tree.nodes,
    edges: mirroredEdges,
  };

  const sign = (tree.nodes.length % 2 === 0) ? 1 : -1;

  return {
    tree: mirroredTree,
    sign,
    explanation: `Antipode S(T): mirrored tree with sign (−1)^${tree.nodes.length} = ${sign}. In QOTE terms, this is the same journey viewed through the zero-flip frame.`,
  };
}

// Create a simple rooted chain (path graph)
export function createChain(length: number): Tree {
  const nodes: NodeId[] = [];
  const edges: Edge[] = [];

  for (let i = 0; i < length; i++) {
    nodes.push(`n${i}`);
    if (i > 0) {
      edges.push({ from: `n${i - 1}`, to: `n${i}` });
    }
  }

  return {
    id: `chain_${length}`,
    root: 'n0',
    nodes,
    edges,
  };
}

// Create a Y-tree (root with 2 children)
export function createYTree(): Tree {
  return {
    id: 'y_tree',
    root: 'n0',
    nodes: ['n0', 'n1', 'n2'],
    edges: [
      { from: 'n0', to: 'n1' },
      { from: 'n0', to: 'n2' },
    ],
  };
}

// Add a child to a node
export function addChild(tree: Tree, parentId: NodeId): Tree {
  // Generate new node ID
  const existingNumbers = tree.nodes
    .map(n => n.match(/^n(\d+)$/)?.[1])
    .filter(Boolean)
    .map(Number);
  const maxNum = existingNumbers.length > 0 ? Math.max(...existingNumbers) : -1;
  const newNodeId = `n${maxNum + 1}`;

  return {
    ...tree,
    nodes: [...tree.nodes, newNodeId],
    edges: [...tree.edges, { from: parentId, to: newNodeId }],
  };
}

// Delete a node and its subtree
export function deleteNode(tree: Tree, nodeId: NodeId): Tree | null {
  // Cannot delete root
  if (nodeId === tree.root) return null;

  return removeSubtree(tree, nodeId);
}

// Compute simple tree layout for SVG rendering
export function computeTreeLayout(tree: Tree, width: number, height: number): TreeLayout {
  const layout = new Map<NodeId, TreePosition>();

  // Calculate depth of each node
  const depths = new Map<NodeId, number>();
  const computeDepth = (nodeId: NodeId): number => {
    if (depths.has(nodeId)) return depths.get(nodeId)!;
    const parent = getParent(tree, nodeId);
    const depth = parent ? computeDepth(parent) + 1 : 0;
    depths.set(nodeId, depth);
    return depth;
  };

  tree.nodes.forEach(node => computeDepth(node));

  const maxDepth = Math.max(...Array.from(depths.values()));
  const verticalSpacing = maxDepth > 0 ? height / (maxDepth + 1) : height / 2;

  // Group nodes by depth
  const nodesByDepth = new Map<number, NodeId[]>();
  tree.nodes.forEach(node => {
    const depth = depths.get(node)!;
    if (!nodesByDepth.has(depth)) {
      nodesByDepth.set(depth, []);
    }
    nodesByDepth.get(depth)!.push(node);
  });

  // Position nodes
  nodesByDepth.forEach((nodes, depth) => {
    const horizontalSpacing = width / (nodes.length + 1);
    nodes.forEach((node, index) => {
      layout.set(node, {
        x: horizontalSpacing * (index + 1),
        y: verticalSpacing * (depth + 0.5),
      });
    });
  });

  return layout;
}
