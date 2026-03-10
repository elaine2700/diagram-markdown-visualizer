import { hierarchy, tree } from 'd3-hierarchy';
import { TreeNode } from './parser.js';

export interface Point {
    x: number;
    y: number;
}

export interface LayoutNode extends Point {
    id: string; // generated id
    title: string;
    content: string;
    depth: number;
    hasChildren: boolean;
}

export interface LayoutLink {
    source: LayoutNode;
    target: LayoutNode;
}

export interface LayoutResult {
    nodes: LayoutNode[];
    links: LayoutLink[];
}

export interface LayoutOptions {
    cardWidth?: number;
    cardHeight?: number;
}

export function calculateLayout(rootNode: TreeNode, options: LayoutOptions): LayoutResult {
    let cardWidth = 0;
    let cardHeight = 0;

    if (options) {
        cardWidth = options.cardWidth ?? 0;
        cardHeight = options.cardHeight ?? 0;
    }

    // 1. Create hierarchy
    const root = hierarchy(rootNode, d => d.children);

    let maxDepth = 0;
    const nodesPerDepth = new Map<number, number>();

    root.each(d => {
        if (d.depth > maxDepth) maxDepth = d.depth;
        nodesPerDepth.set(d.depth, (nodesPerDepth.get(d.depth) || 0) + 1);
    });

    let rx = 1;
    let ry = 1;

    if (!(cardWidth > 0 && cardHeight > 0 && maxDepth > 0)) {
        return { nodes: [], links: [] };
    }

    const paddingX = 40;
    const paddingY = 80;
    const maxDim = Math.max(cardWidth, cardHeight);

    rx = cardWidth / maxDim;
    ry = cardHeight / maxDim;

    const assumedPadding = Math.max(paddingX, paddingY);
    let requiredRadius = maxDepth * (maxDim + assumedPadding); // base radial spacing

    for (const [depth, count] of nodesPerDepth.entries()) {
        if (depth === 0) continue;
        // Add a multiplier to compensate for d3 tree not distributing nodes perfectly evenly
        // Some branches might be denser, so we add a little extra space.
        const requiredCircumference = count * (maxDim + assumedPadding) * 1.5;
        const r_depth = requiredCircumference / (2 * Math.PI);
        const r_max_for_depth = r_depth * (maxDepth / depth);
        if (r_max_for_depth > requiredRadius) {
            requiredRadius = r_max_for_depth;
        }
    }

    let radiusConfig = requiredRadius

    // 2. Setup tree layout mapped to polar coordinates
    // size[0] is the angle (0 to 2π), size[1] is the max radius
    const treeLayout = tree<TreeNode>()
        .size([2 * Math.PI, radiusConfig])
        .separation((a, b) => (a.parent === b.parent ? 1 : 2) / a.depth);

    // 3. Apply layout
    treeLayout(root);

    // 4. Transform coordinates from polar to Cartesian
    const layoutNodesMap = new Map<typeof root, LayoutNode>();
    let idCounter = 0;

    const nodes: LayoutNode[] = root.descendants().map(d => {
        // d.x is angle, d.y is radius
        // We subtract Math.PI / 2 from angle so that the angle 0 starts at the top (12 o'clock)
        const angle = (d.x || 0) - Math.PI / 2;
        const radius = d.y || 0;

        const layoutNode: LayoutNode = {
            id: `node-${idCounter++}`, // Generate a unique ID
            title: d.data.title,
            content: d.data.content,
            depth: d.depth,
            hasChildren: !!d.children && d.children.length > 0,
            x: radius * Math.cos(angle) * rx,
            y: radius * Math.sin(angle) * ry,
        };

        layoutNodesMap.set(d, layoutNode);
        return layoutNode;
    });

    const links: LayoutLink[] = root.links().map(link => {
        const sourceNode = layoutNodesMap.get(link.source as any);
        const targetNode = layoutNodesMap.get(link.target as any);

        if (!sourceNode || !targetNode) {
            throw new Error("Layout node not found in map during link generation");
        }

        return {
            source: sourceNode,
            target: targetNode
        };
    });

    return { nodes, links };
}

