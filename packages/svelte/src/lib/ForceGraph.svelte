<script lang="ts">
    import { calculateForceLayout, type TreeNode } from "core";
    import { solidColors } from "./themes.js";
    import { drag } from "d3-drag";
    import { select } from "d3-selection";

    let {
        tree,
        title = "Diagram title",
        showContent = true,
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
        calculateForceLayout(tree, { cardWidth, cardHeight, nodeShape }),
    );
    let nodes = $derived(layout.nodes);
    let links = $derived(layout.links);

    let tickCounter = $state(0);

    $effect(() => {
        let sim = layout.simulation;
        if (sim) {
            sim.on("tick", () => {
                tickCounter++;
            });
        }
        return () => {
            if (sim) {
                sim.on("tick", null);
            }
        };
    });

    function draggable(nodeElement: SVGElement, nodeData: any) {
        let sim = layout.simulation;
        const d3_drag = drag()
            .on("start", (event: any) => {
                if (!event.active) sim.alphaTarget(0.3).restart();
                nodeData.fx = nodeData.x;
                nodeData.fy = nodeData.y;
            })
            .on("drag", (event: any) => {
                nodeData.fx = event.x;
                nodeData.fy = event.y;
            })
            .on("end", (event: any) => {
                if (!event.active) sim.alphaTarget(0);
                nodeData.fx = null;
                nodeData.fy = null;
            });

        select(nodeElement).call(d3_drag as any);
        return {
            destroy() {
                select(nodeElement).on(".drag", null);
            },
        };
    }

    let maxExtent = $derived(
        nodes.length > 0
            ? Math.max(
                  ...nodes.map(
                      (n: any) =>
                          Math.max(Math.abs(n.x), Math.abs(n.y)) +
                          (n.size ?? Math.max(cardWidth, cardHeight)) / 2,
                  ),
              ) + visualPadding
            : 10,
    );

    let viewBoxDim = $derived(maxExtent * 2);

    let themeColors = $derived(theme);
</script>

<svg
    width={viewBoxDim}
    height={viewBoxDim}
    viewBox="{-maxExtent} {-maxExtent} {viewBoxDim} {viewBoxDim}"
>
    <!-- Links -->
    <g>
        {#each links as link (link.source.id + "-" + link.target.id)}
            <line
                x1={link.source.x + (tickCounter ? 0 : 0)}
                y1={link.source.y + (tickCounter ? 0 : 0)}
                x2={link.target.x + (tickCounter ? 0 : 0)}
                y2={link.target.y + (tickCounter ? 0 : 0)}
                stroke="#999"
                stroke-width="1.5"
                stroke-opacity="0.6"
            />
        {/each}

        <!-- Nodes -->

        {#each nodes as node (node.id)}
            <g
                transform="translate({node.x + (tickCounter ? 0 : 0)},{node.y +
                    (tickCounter ? 0 : 0)})"
                use:draggable={node}
                style="cursor: grab;"
            >
                <foreignObject
                    x={-((node.size ?? cardWidth) / 2)}
                    y={-((node.size ?? cardHeight) / 2)}
                    width={node.size ?? cardWidth}
                    height={node.size ?? cardHeight}
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
        flex-shrink: 0;
    }

    .node-desc {
        font-size: 10px;
        line-height: 1.2;
        white-space: pre-wrap;
    }
</style>
