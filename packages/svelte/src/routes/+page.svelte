<script lang="ts">
    import { RadialTree } from "$lib/index.js";
    import { parseToTree } from "core";

    const markdown =
        "# Hello World\n\nThis is the first level paragraph\n\n## Second Level\n\n### Third Level\n\n## Another second level \n\n# Another first level\n\nThis is the second level paragraph\n\n# Testing first level";
    const tree = parseToTree(markdown);
</script>

<h1>Diagram Markdown Visualizer Demo</h1>
<p>Visualize your markdown files as diagrams using a radial tree layout</p>
<RadialTree {tree} />
