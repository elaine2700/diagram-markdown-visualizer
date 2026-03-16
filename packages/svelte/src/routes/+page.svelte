<script lang="ts">
    import { RadialTree, ForceGraph } from "$lib/index.js";
    import { parseToTree } from "@markdown-to-diagram/core";

    const markdown =
        "# Hello World\n\nThis is the first level paragraph.\n\nHello\n\nOther line.\n\nMore lines.\n\n## Second Level\n\n### Third Level\n\nContent of third level\n\n### Another third level\n\n## Another second level \n\n# Another first level\n\nThis is the second level paragraph\n\n# Testing first level";
    const tree = parseToTree(markdown);

    let nodeShape: "ellipse" | "rectangle" = $state("rectangle");
    let visualizationType: "radial" | "force" = $state("radial");
</script>

<h1>Diagram Markdown Visualizer Demo</h1>
<p>
    Visualize your markdown files as diagrams using a radial tree layout or a
    force graph
</p>

<label style="margin-bottom: 20px; display: block;">
    Visualization Type:
    <select bind:value={visualizationType}>
        <option value="radial">Radial Tree</option>
        <option value="force">Force Graph</option>
    </select>
</label>

<label style="margin-bottom: 20px; display: block;">
    Node Shape:
    <select bind:value={nodeShape}>
        <option value="rectangle">Rectangle</option>
        <option value="ellipse">Ellipse</option>
    </select>
</label>

{#if visualizationType === "radial"}
    <RadialTree {tree} {nodeShape} />
{:else}
    <ForceGraph {tree} {nodeShape} />
{/if}
