"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateLayout = calculateLayout;
const d3_hierarchy_1 = require("d3-hierarchy");
function calculateLayout(rootNode, radiusConfig) {
    // 1. Create hierarchy
    const root = (0, d3_hierarchy_1.hierarchy)(rootNode, d => d.children);
    // 2. Setup tree layout mapped to polar coordinates
    // size[0] is the angle (0 to 2π), size[1] is the max radius
    const treeLayout = (0, d3_hierarchy_1.tree)().size([2 * Math.PI, radiusConfig]);
    // 3. Apply layout
    treeLayout(root);
    // 4. Transform coordinates from polar to Cartesian
    const layoutNodesMap = new Map();
    let idCounter = 0;
    const nodes = root.descendants().map(d => {
        // d.x is angle, d.y is radius
        // We subtract Math.PI / 2 from angle so that the angle 0 starts at the top (12 o'clock)
        const angle = (d.x || 0) - Math.PI / 2;
        const radius = d.y || 0;
        const layoutNode = {
            id: `node-${idCounter++}`, // Generate a unique ID
            title: d.data.title,
            content: d.data.content,
            depth: d.depth,
            x: radius * Math.cos(angle),
            y: radius * Math.sin(angle),
        };
        layoutNodesMap.set(d, layoutNode);
        return layoutNode;
    });
    const links = root.links().map(link => {
        const sourceNode = layoutNodesMap.get(link.source);
        const targetNode = layoutNodesMap.get(link.target);
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
