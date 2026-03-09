<script lang="ts">
    import {
        calculateLayout,
        type TreeNode,
        type LayoutNode,
        type LayoutLink,
    } from "core";

    let { tree, radius = 500 }: { tree: TreeNode; radius?: number } = $props();

    let layout = $derived(calculateLayout(tree, radius));
    let nodes = $derived(layout.nodes);
    let links = $derived(layout.links);
</script>

<svg
    width={radius * 2}
    height={radius * 2}
    viewBox="{-radius} {-radius} {radius * 2} {radius * 2}"
>
    <!-- Links -->
    {#each links as link (link.source.id + "-" + link.target.id)}
        <line
            x1={link.source.x}
            y1={link.source.y}
            x2={link.target.x}
            y2={link.target.y}
            stroke="#999"
            stroke-width="1.5"
            stroke-opacity="0.6"
        />
    {/each}

    <!-- Nodes -->
    {#each nodes as node (node.id)}
        <g transform="translate({node.x},{node.y})">
            <circle
                r={node.depth === 0 ? 8 : 4}
                fill={node.hasChildren ? "#555" : "#999"}
                stroke="#fff"
                stroke-width="1.5"
            />

            <text
                dy="0.31em"
                x={node.x < 0 ? -6 : 6}
                text-anchor={node.x < 0 ? "end" : "start"}
                fill="currentColor"
                font-family="sans-serif"
                font-size="10px"
            >
                {node.title}
            </text>
        </g>
    {/each}
</svg>

<style>
    svg {
        max-width: 100%;
        height: auto;
    }
</style>
