import { Minus, Paintbrush, Pencil } from "lucide-react";

import { Point } from "./types";

type ToolHandler = {
  onMouseDown: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseMove: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseUp: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseLeave: (ctx: CanvasRenderingContext2D, point: Point) => void;
};

type ExtractedLineCap = Extract<CanvasLineCap, "round" | "square">;

const TOOLS = {
  FREE_HAND: {
    id: "FREE_HAND",
    icon: Pencil,
    handler: {
      onMouseDown: (ctx, point) => {
        drawInitShape(ctx, point);
        const { x, y } = point;

        ctx.beginPath();
        ctx.moveTo(x, y);
      },
      onMouseMove: (ctx, point) => {
        const { x, y } = point;

        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseUp: (ctx, point) => {
      },
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
  PAINT_BRUSH: {
    id: "PAINT_BRUSH",
    icon: Paintbrush,
    handler: {
      onMouseDown: (ctx, point) => {
        drawInitShape(ctx, point);
        const { x, y } = point;

        ctx.beginPath();
        ctx.moveTo(x, y);
      },
      onMouseMove: (ctx, point) => {
        const { x, y } = point;

        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseUp: () => {
      },
      onMouseLeave: () => {},
    } satisfies ToolHandler,
    shape_options: {
      round: [2, 4, 6],
      square: [2, 4, 6],
    } satisfies Record<ExtractedLineCap, number[]>,
  },
  STRAIGHT_LINE: {
    id: "STRAIGHT_LINE",
    icon: Minus,
    handler: {
      onMouseDown: (ctx, point) => {
        drawInitShape(ctx, point);
        
        const { x, y } = point;
        ctx.beginPath();
        ctx.moveTo(x, y);
      },
      onMouseMove: (ctx, point) => {
        const { x, y } = point;
      },
      onMouseUp: (ctx, point) => {
        const { x, y } = point;
        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseLeave: () => {},
    } satisfies ToolHandler,
    shape_options: {
      round: [2, 4, 6],
      square: [2, 4, 6],
    } satisfies Record<ExtractedLineCap, number[]>,
  },
} as const;

type ToolId = (typeof TOOLS)[keyof typeof TOOLS]["id"];

export { type ExtractedLineCap, type ToolHandler, type ToolId, TOOLS };

function drawInitShape(ctx: CanvasRenderingContext2D, point: Point) {
  const { x, y } = point;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}
