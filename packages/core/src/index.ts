import { remark } from 'remark';
import remarkParse from 'remark-parse';
import { toString } from 'mdast-util-to-string';

export interface TreeNode {
    title: string;
    content: string;
    children: TreeNode[];
}

export function parseToTree(markdown: string): TreeNode {
    const ast = remark().use(remarkParse).parse(markdown);

    const root: TreeNode = {
        title: 'root',
        content: '',
        children: []
    };

    const stack: (TreeNode | null)[] = [root];

    for (const node of ast.children) {
        if (node.type === 'heading') {
            const depth = (node as any).depth as number;

            const newNode: TreeNode = {
                title: toString(node),
                content: '',
                children: []
            };

            // Find the closest valid parent
            let parentDepth = depth - 1;
            while (parentDepth >= 0 && !stack[parentDepth]) {
                parentDepth--;
            }

            const parent = stack[parentDepth] || root;
            parent.children.push(newNode);

            stack[depth] = newNode;

            // Invalidate any deeper headings since we just started a new section
            for (let i = depth + 1; i < stack.length; i++) {
                stack[i] = null;
            }
        } else {
            // Find the current active section to append content to
            let currentDepth = stack.length - 1;
            while (currentDepth >= 0 && !stack[currentDepth]) {
                currentDepth--;
            }
            const activeNode = stack[currentDepth] || root;

            const text = toString(node);
            if (text.trim() !== '') {
                activeNode.content = activeNode.content
                    ? activeNode.content + '\n' + text
                    : text;
            }
        }
    }

    return root;
}
