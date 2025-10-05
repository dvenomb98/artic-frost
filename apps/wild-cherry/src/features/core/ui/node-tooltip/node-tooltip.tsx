"use client";

import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {useCoreStore} from "@core/store/provider";
import {NodePointTuple} from "@core/store/store";
import {getMinMaxPoints} from "@core/engine/math";
import {Content} from "./content";
import {useEngine} from "@core/engine/provider";
import {UI_CONFIG} from "../const";

function NodeTooltip() {
  const {ctx, frame, getHighlightedNodes, nodes, isCameraActive} = useCoreStore(
    state => ({
      ctx: state.ctx,
      frame: state.frame,
      getHighlightedNodes: state.getHighlightedNodes,
      nodes: state.nodes,
      isCameraActive: state.isCameraActive,
    })
  );

  const engine = useEngine();

  if (!ctx || isCameraActive) return null;

  const highlightedNodes = getHighlightedNodes(nodes);

  if (!highlightedNodes.length) return null;

  // const calcFramePosition = !!frame && highlightedNodes.length > 1;
  const calcFramePosition = !!frame && highlightedNodes.length;

  const position = calcFramePosition
    ? getPosition(ctx, engine, frame.points)
    : getPosition(ctx, engine, highlightedNodes[0]!.points);

  return (
    <TooltipProvider>
      <Tooltip open={true}>
        <TooltipTrigger
          className="invisible fixed translate-x-[-50%] translate-y-[-100%]"
          style={{
            left: position.x,
            top: position.y,
          }}
        />
        <Content nodes={highlightedNodes} />
      </Tooltip>
    </TooltipProvider>
  );
}

export {NodeTooltip};

function getPosition(
  ctx: CanvasRenderingContext2D,
  engine: ReturnType<typeof useEngine>,
  points: NodePointTuple
) {
  if (!points[0] || !points[1])
    return {x: window.innerWidth / 2, y: window.innerHeight / 2};

  const {minX, maxX, minY} = getMinMaxPoints(points);

  const centerX = (minX + maxX) / 2;
  const centerY = minY - UI_CONFIG.NODE_TOOLTIP_OFFSET;

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
