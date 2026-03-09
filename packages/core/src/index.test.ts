import { describe, it, expect } from 'vitest';
import { parseToTree, TreeNode } from './index';

describe('parseToTree', () => {
    it('should parse a basic hierarchy correctly', () => {
        const markdown = `
# Main Title
This is the root content.

## Subtitle 1
Content for subtitle 1.

### Sub-subtitle A
Content for sub-subtitle A.

## Subtitle 2
Content for subtitle 2.
    `;

        const tree = parseToTree(markdown);

        expect(tree.title).toBe('root');
        expect(tree.content).toBe(''); // We didn't append "This is the root content." to root because "Main Title" is h1

        expect(tree.children.length).toBe(1);

        // H1
        const h1 = tree.children[0];
        expect(h1.title).toBe('Main Title');
        expect(h1.content).toBe('This is the root content.');
        expect(h1.children.length).toBe(2);

        // H2 - 1
        const h2_1 = h1.children[0];
        expect(h2_1.title).toBe('Subtitle 1');
        expect(h2_1.content).toBe('Content for subtitle 1.');
        expect(h2_1.children.length).toBe(1);

        // H3 - A
        const h3_a = h2_1.children[0];
        expect(h3_a.title).toBe('Sub-subtitle A');
        expect(h3_a.content).toBe('Content for sub-subtitle A.');
        expect(h3_a.children.length).toBe(0);

        // H2 - 2
        const h2_2 = h1.children[1];
        expect(h2_2.title).toBe('Subtitle 2');
        expect(h2_2.content).toBe('Content for subtitle 2.');
        expect(h2_2.children.length).toBe(0);
    });

    it('should handle missing parent header levels gracefully', () => {
        // Meaning it skips H2 and goes straight to H3
        const markdown = `
# Title

### Deep Title
Content.
    `;

        const tree = parseToTree(markdown);
        const h1 = tree.children[0];
        expect(h1.title).toBe('Title');
        expect(h1.children.length).toBe(1);

        const h3 = h1.children[0];
        expect(h3.title).toBe('Deep Title');
        expect(h3.content).toBe('Content.');
    });

    it('should handle content before any headings', () => {
        const markdown = `
Intro text before any heading.

# Heading
Text.
    `;

        const tree = parseToTree(markdown);
        expect(tree.content).toBe('Intro text before any heading.');
        expect(tree.children.length).toBe(1);
        expect(tree.children[0].title).toBe('Heading');
    });
});
