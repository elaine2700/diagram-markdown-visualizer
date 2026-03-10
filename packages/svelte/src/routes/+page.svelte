<script lang="ts">
    import { RadialTree } from "$lib/index.js";
    import { parseToTree } from "core";

    const markdown =
        "# Hello World\n\nThis is the first level paragraph\n\n## Second Level\n\n### Third Level\n\nContent of third level\n\n### Another third level\n\n## Another second level \n\n# Another first level\n\nThis is the second level paragraph\n\n# Testing first level";
    const tree = parseToTree(markdown);

    let nodeShape: 'ellipse' | 'rectangle' = $state('rectangle');
</script>

<h1>Diagram Markdown Visualizer Demo</h1>
<p>Visualize your markdown files as diagrams using a radial tree layout</p>

<label style="margin-bottom: 20px; display: block;">
    Node Shape:
    <select bind:value={nodeShape}>
        <option value="rectangle">Rectangle</option>
        <option value="ellipse">Ellipse</option>
    </select>
</label>

<RadialTree {tree} {nodeShape} />
