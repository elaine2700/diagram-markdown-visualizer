# markdown-to-diagram

This package provides the core logic to parse markdown into visual diagrams. 
It supports standard text layout and relationships structure.

## Installation

```bash
npm install markdown-to-diagram
```

## Usage

### Parsing Markdown
You can parse a Markdown string into a nested tree structure where headings define the hierarchy, and the text below them becomes the content.

```typescript
import { parseToTree, type TreeNode } from 'markdown-to-diagram';

const markdown = `
# Main Concept
This is the root idea.
## Sub Concept 1
Details about sub concept 1.
## Sub Concept 2
Details about sub concept 2.
`;

const tree: TreeNode = parseToTree(markdown);
```

### Calculating Layouts
The package also exports functions to calculate positions for the Tree nodes.

```typescript
import { calculateRadialLayout, calculateForceLayout } from 'markdown-to-diagram';

// Calculate a radial tree layout
const radialLayout = calculateRadialLayout(tree, { cardWidth: 200, cardHeight: 50 });

// Calculate a force-directed layout
const forceLayout = calculateForceLayout(tree, { cardWidth: 200, cardHeight: 50, nodeShape: 'rectangle' });
```

## License
MIT
