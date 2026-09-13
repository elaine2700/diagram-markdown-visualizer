<script lang="ts">
    import { RadialTree, ForceGraph } from "$lib/index.js";
    import { parseToTree } from "@markdown-to-diagram/core";

    const markdown =
        "# Hello World\n\nThis is the first level paragraph.\n\nHello\n\nOther line.\n\nMore lines.\n\n## Second Level\n\n### Third Level\n\nContent of third level\n\n### Another third level\n\n## Another second level \n\n# Another first level\n\nThis is the second level paragraph\n\n# Testing first level";
    const tree = parseToTree(markdown);

    let nodeShape: "ellipse" | "rectangle" = $state("rectangle");
    let visualizationType: "radial" | "force" = $state("radial");
    let showContent: boolean = $state(false);
</script>

<h1>Diagram Markdown Visualizer Demo</h1>
<p>
    Visualize your markdown files as diagrams using a radial tree layout or a
    force graph
</p>

<div style="display: flex; gap: 20px; align-items: center; margin-bottom: 20px; flex-wrap: wrap;">
    <label>
        Visualization Type:
        <select bind:value={visualizationType}>
            <option value="radial">Radial Tree</option>
            <option value="force">Force Graph</option>
        </select>
    </label>

    <label>
        Node Shape:
        <select bind:value={nodeShape}>
            <option value="rectangle">Rectangle</option>
            <option value="ellipse">Ellipse</option>
        </select>
    </label>

    <label style="display: flex; align-items: center; gap: 6px; cursor: pointer;">
        <input type="checkbox" bind:checked={showContent} />
        Show Content
    </label>
</div>

{#if visualizationType === "radial"}
    <div class="diagram-container">
        <RadialTree {tree} {nodeShape} {showContent} title="Document Overview" />
    </div>
{:else}
    <div class="diagram-container">
        <ForceGraph {tree} {nodeShape} {showContent} title="Document Overview" />
    </div>
{/if}

<style>
    :global(body) {
        margin: 0;
        padding: 2rem;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        background-color: #f8fafc;
        color: #1e293b;
    }

    h1 {
        margin-top: 0;
        font-size: 1.75rem;
        font-weight: 700;
        color: #0f172a;
    }

    p {
        color: #64748b;
        margin-bottom: 1.5rem;
    }

    .diagram-container {
        background: #ffffff;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    select {
        padding: 6px 12px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background-color: #ffffff;
        font-size: 14px;
        color: #334155;
    }
</style>
