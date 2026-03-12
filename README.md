# Diagram Markdown Visualizer

A modular toolkit for parsing Markdown documents and visualizing their heading structure as interactive diagrams.

This repository is split into two packages:
- **`markdown-to-diagram`**: For parsing markdown into tree structures and calculating layouts.
- **`markdown-to-diagram-svelte`**: A set of Svelte components for rendering the calculated layouts as interactive SVG diagrams.

---

## `markdown-to-diagram`

The `core` package handles the parsing of Markdown documents into a hierarchical `TreeNode` structure using `remark` and provides layout calculation functions backed by `d3-hierarchy` and `d3-force`.

### Installation
```bash
npm install markdown-to-diagram
```

### Usage

#### Parsing Markdown
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

#### Calculating Layouts
The package also exports functions to calculate positions for the Tree nodes.

```typescript
import { calculateRadialLayout, calculateForceLayout } from 'markdown-to-diagram';

// Calculate a radial tree layout
const radialLayout = calculateRadialLayout(tree, { cardWidth: 200, cardHeight: 50 });

// Calculate a force-directed layout
const forceLayout = calculateForceLayout(tree, { cardWidth: 200, cardHeight: 50, nodeShape: 'rectangle' });
```

---

## `markdown-to-diagram-svelte`

The `svelte` package provides read-to-use Svelte 5 components that consume the `TreeNode` structure and render attractive, interactive network diagrams or radial trees.

### Installation
```bash
npm install markdown-to-diagram-svelte markdown-to-diagram
```
*(Requires `svelte` as a peer dependency)*

### Usage

Use the components in your Svelte application by passing in the parsed `TreeNode` obtained from the `core` package.

#### Radial Tree
Renders a neat, hierarchical radial tree.

```svelte
<script lang="ts">
    import { RadialTree } from 'markdown-to-diagram-svelte';
    import { parseToTree } from 'markdown-to-diagram';

    // Provided from somewhere
    let markdownString = "..."; 
    let tree = parseToTree(markdownString);
</script>

<RadialTree 
    {tree} 
    title="My Diagram" 
    showContent={true} 
    nodeShape="rectangle" 
/>
```

#### Force Graph
Renders an interactive, draggable force-directed graph. 

```svelte
<script lang="ts">
    import { ForceGraph } from 'markdown-to-diagram-svelte';
    import { parseToTree } from 'markdown-to-diagram';

    let markdownString = "...";
    let tree = parseToTree(markdownString);
</script>

<ForceGraph 
    {tree} 
    title="My Interactive Graph" 
    showContent={true}
    nodeShape="ellipse" 
/>
```

### Component Props

Both `RadialTree` and `ForceGraph` accept similar properties:

| Prop | Type | Default | Description |
|---|---|---|---|
| `tree` | `TreeNode` | **Required** | The parsed Markdown tree object. |
| `title` | `string` | `"Diagram title"` | The fallback title for the root node. |
| `showContent` | `boolean` | `true`/`false` | Whether to display the text content inside the nodes. |
| `cardWidth` | `number` | `200` | The width of the rectangle node (or base size). |
| `cardHeight` | `number` | `50` | The height of the rectangle node. |
| `visualPadding` | `number` | `10` | Extra padding around the SVG viewBox. |
| `theme` | `string[]` | Default arrays | An array of CSS color strings used for node colors based on depth. |
| `nodeShape` | `"ellipse" \| "rectangle"` | `"rectangle"` | The shape of the rendered nodes. |
