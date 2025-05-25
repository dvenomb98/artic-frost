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

function NodeTooltip() {
  const {ctx, getHighlightedNodes, frame} = useCoreStore(state => state);

  if (!ctx) return null;

  const highlightedNodes = getHighlightedNodes();

  if (!highlightedNodes.length) return null;

  console.log(highlightedNodes, "nodes");
  console.log(frame, "frame");

  const calcFramePosition = !!frame && highlightedNodes.length > 1;

  const position = calcFramePosition
    ? getPosition(ctx, frame.points)
    : getPosition(ctx, highlightedNodes[0]!.points);

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

function getPosition(ctx: CanvasRenderingContext2D, points: NodePointTuple) {
  const rect = ctx.canvas.getBoundingClientRect();

  if (!points[0] || !points[1])
    return {x: window.innerWidth / 2, y: window.innerHeight / 2};

  const {minX, maxX, minY} = getMinMaxPoints(points);

  const centerX = (minX + maxX) / 2;
  const centerY = minY - NODE_TOOLTIP_OFFSET;

  return {
    x: centerX + rect.left,
    y: centerY + rect.top,
  };
}
