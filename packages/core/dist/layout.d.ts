import { TreeNode } from './parser';
export interface Point {
    x: number;
    y: number;
}
export interface LayoutNode extends Point {
    id: string;
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
export declare function calculateLayout(rootNode: TreeNode, radiusConfig: number): LayoutResult;
