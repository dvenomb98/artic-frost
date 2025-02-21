import { Paintbrush, Pencil } from "lucide-react";

import { Point } from "./types";

type ToolHandler = {
  onMouseDown: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseMove: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseUp: (ctx: CanvasRenderingContext2D) => void;
  onMouseLeave: (ctx: CanvasRenderingContext2D) => void;
};

const TOOLS = {
  FREE_HAND: {
    id: "FREE_HAND",
    icon: Pencil,
    handler: {
      onMouseDown: (ctx, point) => {
        const { x, y } = point;

        ctx.beginPath();
        ctx.arc(x, y, ctx.lineWidth / 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      },
      onMouseMove: (ctx, point) => {
        const { x, y } = point;

        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseUp: () => {},
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
  PAINT_BRUSH: {
    id: "PAINT_BRUSH",
    icon: Paintbrush,
    handler: {
      onMouseDown: (ctx, point) => {},
      onMouseMove: (ctx, point) => {},
      onMouseUp: () => {},
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
} as const;

type ToolId = (typeof TOOLS)[keyof typeof TOOLS]["id"];

export { type ToolHandler, type ToolId, TOOLS };
