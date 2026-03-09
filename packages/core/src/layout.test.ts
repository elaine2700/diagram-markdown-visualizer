import { describe, it, expect } from 'vitest';
import { calculateLayout } from './layout';
import { parseToTree } from './parser';

describe('calculateLayout', () => {
    it('should generate nodes and links for a simple tree', () => {
        const markdown = `
# Root
## Child 1
### Grandchild 1
## Child 2
        `;

        const tree = parseToTree(markdown);
        const radiusConfig = 100;

        const result = calculateLayout(tree, radiusConfig);

        // Root (depth 0), Child 1 (depth 1), Grandchild 1 (depth 2), Child 2 (depth 1), and the very top 'root' parsed by the parser
        expect(result.nodes.length).toBe(5); // The parser wraps everything in a virtual "root" top node

        // Since it's a tree of 5 nodes, there should be 4 links
        expect(result.links.length).toBe(4);

        // Check if IDs are assigned
        result.nodes.forEach(node => {
            expect(node.id).toBeDefined();
            expect(typeof node.id).toBe('string');
        });

        // The root node (the virtual one) should be at depth 0, meaning radius goes from 0
        const rootLayoutNode = result.nodes.find(n => n.depth === 0);
        expect(rootLayoutNode).toBeDefined();
        if (rootLayoutNode) {
            // angle doesn't matter much for radius 0, x and y should be 0
            expect(rootLayoutNode.x).toBeCloseTo(0);
            expect(rootLayoutNode.y).toBeCloseTo(0);
        }

        // Links should reference node objects
        result.links.forEach(link => {
            expect(link.source).toBeDefined();
            expect(link.target).toBeDefined();
            expect(link.target.depth).toBe(link.source.depth + 1);
        });
    });

    it('should correctly map polar to Cartesian coordinates', () => {
        const markdown = `
# Title
## A
## B
## C
## D
        `;

        const tree = parseToTree(markdown);
        const radiusConfig = 100;
        const result = calculateLayout(tree, radiusConfig);

        // Root has 1 child ("Title"), which has 4 children ("A", "B", "C", "D")
        // Note: The tree layout spreads these children at depth 2 along the radius at angle increments.
        // It's mapped 0 to 2*PI radians.

        const depth2Nodes = result.nodes.filter(n => n.depth === 2);
        expect(depth2Nodes.length).toBe(4);

        // For a polar map, depth 2 will have a radius > 0. 
        // We know radiusConfig = 100 means the max depth (2 here) gets radius 100
        depth2Nodes.forEach(node => {
            // Check distance from origin |v| = sqrt(x^2 + y^2)
            const magnitude = Math.sqrt(node.x * node.x + node.y * node.y);
            // Since D3 tree will map max depth to max radius directly
            expect(magnitude).toBeCloseTo(100);
        });
    });
});
