"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseToTree = parseToTree;
const remark_1 = require("remark");
const remark_parse_1 = __importDefault(require("remark-parse"));
const mdast_util_to_string_1 = require("mdast-util-to-string");
function parseToTree(markdown) {
    const ast = (0, remark_1.remark)().use(remark_parse_1.default).parse(markdown);
    const root = {
        title: 'root',
        content: '',
        children: []
    };
    const stack = [root];
    for (const node of ast.children) {
        if (node.type === 'heading') {
            const depth = node.depth;
            const newNode = {
                title: (0, mdast_util_to_string_1.toString)(node),
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
        }
        else {
            // Find the current active section to append content to
            let currentDepth = stack.length - 1;
            while (currentDepth >= 0 && !stack[currentDepth]) {
                currentDepth--;
            }
            const activeNode = stack[currentDepth] || root;
            const text = (0, mdast_util_to_string_1.toString)(node);
            if (text.trim() !== '') {
                activeNode.content = activeNode.content
                    ? activeNode.content + '\n' + text
                    : text;
            }
        }
    }
    return root;
}
