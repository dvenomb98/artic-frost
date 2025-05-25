"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {useCoreStore} from "../../store/provider";
import {CoreNode} from "../../store/store";
import {startEndPointsFromNode} from "../../engine/utils";
import { Content } from "./content";

function NodeTooltip() {
  const {nodes, ctx} = useCoreStore(state => state);

  function renderTooltip() {
    if (!ctx) return null;

    for (const node of nodes) {
      if (!node.highlight) continue;

      const position = getPosition(ctx, node);

      return (
        <TooltipProvider key={node.id}>
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
            <Content node={node} />
          </Tooltip>
        </TooltipProvider>
      );
    }
  }

  return renderTooltip();
}

export {NodeTooltip};

const NODE_TOOLTIP_OFFSET = 16;

function getPosition(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const rect = ctx.canvas.getBoundingClientRect();

  const {startPoint, endPoint} = startEndPointsFromNode(node);

  const centerX = (startPoint.x + endPoint.x) / 2;
  const centerY = startPoint.y - NODE_TOOLTIP_OFFSET;

  return {
    x: centerX + rect.left,
    y: centerY + rect.top,
  };
}
