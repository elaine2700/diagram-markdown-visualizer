<script lang="ts">
    import { calculateLayout, type TreeNode } from "core";

    // TODO: Add option to see the content of the nodes with a button to collapse/expand.
    // TODO: Add option to change the node format, circle or rectangle.
    // TODO: Add formattting css
    // TODO: Add classes and document them to customize the nodes.
    let {
        tree,
        radius = 400,
        showContent = false,
        cardWidth = 200,
        cardHeight = 150,
        visualPadding = 10,
    }: {
        tree: TreeNode;
        radius?: number;
        showContent?: boolean;
        cardWidth?: number;
        cardHeight?: number;
        visualPadding?: number;
    } = $props();

    let layout = $derived(calculateLayout(tree, { cardWidth, cardHeight }));
    let nodes = $derived(layout.nodes);
    let links = $derived(layout.links);

    let minX = $derived(
        nodes.length > 0
            ? Math.min(...nodes.map((n) => n.x)) -
                  (showContent ? cardWidth / 2 + visualPadding : 100)
            : 0,
    );
    let maxX = $derived(
        nodes.length > 0
            ? Math.max(...nodes.map((n) => n.x)) +
                  (showContent ? cardWidth / 2 + visualPadding : 100)
            : 0,
    );
    let minY = $derived(
        nodes.length > 0
            ? Math.min(...nodes.map((n) => n.y)) -
                  (showContent ? cardHeight / 2 + visualPadding : 30)
            : 0,
    );
    let maxY = $derived(
        nodes.length > 0
            ? Math.max(...nodes.map((n) => n.y)) +
                  (showContent ? cardHeight / 2 + visualPadding : 30)
            : 0,
    );

    let viewBoxWidth = $derived(Math.max(maxX - minX, 10));
    let viewBoxHeight = $derived(Math.max(maxY - minY, 10));
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
                        style="background-color: {node.hasChildren
                            ? '#555'
                            : '#999'}"
                    >
                        <div class="node-title" title={node.title}>
                            {node.title}
                        </div>
                        {#if showContent && node.content}
                            <div class="node-desc">{node.content}</div>
                        {/if}
                    </div>
                </foreignObject>
                <!-- {:else}
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
                {/if} -->
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
        border: 1.5px solid #fff;
        border-radius: 4px;
        padding: 6px;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        font-family: sans-serif;
    }

    .node-title {
        font-size: 12px;
        font-weight: bold;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex-shrink: 0;
    }

    .node-desc {
        font-size: 10px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 4;
        line-clamp: 4;
        -webkit-box-orient: vertical;
        line-height: 1.2;
        white-space: pre-wrap;
    }
</style>
