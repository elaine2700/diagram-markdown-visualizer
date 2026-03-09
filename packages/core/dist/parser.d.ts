export interface TreeNode {
    title: string;
    content: string;
    children: TreeNode[];
}
export declare function parseToTree(markdown: string): TreeNode;
