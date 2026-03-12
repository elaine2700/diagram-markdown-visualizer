<script lang="ts">
    import { calculateRadialLayout, type TreeNode } from "markdown-to-diagram";
    import { solidColors } from "./themes.js";

    let {
        tree,
        title = "Graph title",
        showContent = false,
        cardWidth = 200,
        cardHeight = 50,
        visualPadding = 10,
        theme = solidColors,
        nodeShape = "rectangle",
    }: {
        tree: TreeNode;
        title?: string;
        showContent?: boolean;
        cardWidth?: number;
        cardHeight?: number;
        visualPadding?: number;
        theme?: string[];
        nodeShape?: "ellipse" | "rectangle";
    } = $props();

    let layout = $derived(
        calculateRadialLayout(tree, { cardWidth, cardHeight }),
    );
    let nodes = $derived(layout.nodes);
    let links = $derived(layout.links);

    let minX = $derived(
        nodes.length > 0
            ? Math.min(...nodes.map((n) => n.x)) -
                  (cardWidth / 2 + visualPadding)
            : 0,
    );
    let maxX = $derived(
        nodes.length > 0
            ? Math.max(...nodes.map((n) => n.x)) +
                  (cardWidth / 2 + visualPadding)
            : 0,
    );
    let minY = $derived(
        nodes.length > 0
            ? Math.min(...nodes.map((n) => n.y)) -
                  (cardHeight / 2 + visualPadding)
            : 0,
    );
    let maxY = $derived(
        nodes.length > 0
            ? Math.max(...nodes.map((n) => n.y)) +
                  (cardHeight / 2 + visualPadding)
            : 0,
    );

    let viewBoxWidth = $derived(Math.max(maxX - minX, 10));
    let viewBoxHeight = $derived(Math.max(maxY - minY, 10));

    let themeColors = $derived(theme);
</script>

<svg
    width={viewBoxWidth}
    height={viewBoxHeight}
    viewBox="{minX} {minY} {viewBoxWidth} {viewBoxHeight}"
>
    <!-- Links -->
    <g>
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
                <foreignObject
                    x={-(cardWidth / 2)}
                    y={-(cardHeight / 2)}
                    width={cardWidth}
                    height={cardHeight}
                >
                    <div
                        xmlns="http://www.w3.org/1999/xhtml"
                        class="node-card"
                        class:node-ellipse={nodeShape === "ellipse"}
                        style="background: {themeColors[node.depth % 7]}"
                    >
                        <div
                            class="node-title"
                            title={node.depth === 0 ? title : node.title}
                        >
                            {node.depth === 0 ? title : node.title}
                        </div>
                        {#if showContent && node.content}
                            <div class="node-desc">{node.content}</div>
                        {/if}
                    </div>
                </foreignObject>
            </g>
        {/each}
    </g>
</svg>

<style>
    svg {
        max-width: 100%;
        height: auto;
    }

    .node-card {
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 0.5rem;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
        justify-content: center;
        overflow-y: auto;
        padding: 0.5rem;
        transition: transform 0.2s ease;
    }

    .node-card:hover {
        transform: translateY(-1px);
    }

    .node-ellipse {
        border-radius: 50%;
    }

    .node-title {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 0.25rem;
        white-space: nowrap;
        flex-shrink: 0;
    }

    .node-desc {
        font-size: 10px;
        /* display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical; */
        line-height: 1.2;
        white-space: pre-wrap;
    }
</style>
