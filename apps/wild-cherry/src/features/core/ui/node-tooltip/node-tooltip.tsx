"use client";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {useCoreStore} from "@core/store/provider";
import {NodePointTuple} from "@core/store/store";
import {getMinMaxPoints} from "@core/engine/collisions";
import {Content} from "./content";
import {useEngine} from "@core/engine/provider";

function NodeTooltip() {
  const {ctx, frame, getHighlightedNodes, nodes} = useCoreStore(state => ({
    ctx: state.ctx,
    frame: state.frame,
    getHighlightedNodes: state.getHighlightedNodes,
    nodes: state.nodes,
  }));

  const engine = useEngine();
  if (!ctx) return null;

  const highlightedNodes = getHighlightedNodes(nodes);

  if (!highlightedNodes.length) return null;

  const calcFramePosition = !!frame && highlightedNodes.length > 1;

  const position = calcFramePosition
    ? getPosition(ctx, engine, frame.points)
    : getPosition(ctx, engine, highlightedNodes[0]!.points);

  return (
    <TooltipProvider>
      <Tooltip open={true}>
        <TooltipTrigger asChild>
          <div
            className="invisible fixed translate-x-[-50%] translate-y-[-100%]"
            style={{
              left: position.x,
              top: position.y,
            }}
          />
        </TooltipTrigger>
        <Content nodes={highlightedNodes} />
      </Tooltip>
    </TooltipProvider>
  );
}

export {NodeTooltip};

const NODE_TOOLTIP_OFFSET = 16;

function getPosition(
  ctx: CanvasRenderingContext2D,
  engine: ReturnType<typeof useEngine>,
  points: NodePointTuple
) {
  if (!points[0] || !points[1])
    return {x: window.innerWidth / 2, y: window.innerHeight / 2};

  const {minX, maxX, minY} = getMinMaxPoints(points);

  const centerX = (minX + maxX) / 2;
  const centerY = minY - NODE_TOOLTIP_OFFSET;

  const screenCoords = engine
    .getEngine()
    .getCameraManager()
    .worldToScreen(ctx, {
      x: centerX,
      y: centerY,
    });

  return {
    x: screenCoords.x,
    y: screenCoords.y,
  };
}
