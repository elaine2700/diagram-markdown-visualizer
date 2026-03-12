# markdown-to-diagram-svelte

This package provides Svelte components (`RadialTree` and `ForceGraph`) to visualize diagrams parsed from Markdown content using the core `markdown-to-diagram` package.

## Installation

```bash
npm install markdown-to-diagram-svelte markdown-to-diagram
```

## Usage

Here is an example of how to use the components in your Svelte application:

```svelte
<script lang="ts">
  import { parseToTree } from 'markdown-to-diagram';
  import { RadialTree, ForceGraph } from 'markdown-to-diagram-svelte';

  const markdownContent = `
# Root Node
- Child 1
- Child 2
  `;

  // Parse markdown content into tree structure
  const tree = parseToTree(markdownContent);
</script>

<main>
  <h2>Radial Tree Visualization</h2>
  <RadialTree {tree} />

  <h2>Force Graph Visualization</h2>
  <ForceGraph {tree} />
</main>
```

### Components

#### `<RadialTree>`
Displays the parsed markdown data as a hierarchical radial tree visualization.

#### `<ForceGraph>`
Displays the parsed markdown data as a highly interactive force-directed graph.

## License
MIT
