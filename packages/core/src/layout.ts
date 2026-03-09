import { hierarchy, tree } from 'd3-hierarchy';
import { TreeNode } from './parser';

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

export function calculateLayout(rootNode: TreeNode, radiusConfig: number): LayoutResult {
    // 1. Create hierarchy
    const root = hierarchy(rootNode, d => d.children);

    // 2. Setup tree layout mapped to polar coordinates
    // size[0] is the angle (0 to 2π), size[1] is the max radius
    const treeLayout = tree<TreeNode>().size([2 * Math.PI, radiusConfig]);

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
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
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
