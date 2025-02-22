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
        createTemp(ctx, point);
      },
      onMouseMove: (ctx, point) => {
        const { startPoint, savedImageData } = getTemp();
        if (!savedImageData) return;
        const { x, y } = point;

        ctx.putImageData(savedImageData, 0, 0);
        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseUp: (ctx, point) => {
        // reset temp (optional)
        clearTemp();
      },
      onMouseLeave: (ctx) => {
        // reset temp (optional)
        clearTemp();
      },
    } satisfies ToolHandler,
    shape_options: {
      round: [2, 4, 6],
      square: [2, 4, 6],
    } satisfies Record<ExtractedLineCap, number[]>,
  },
} as const;

type ToolId = (typeof TOOLS)[keyof typeof TOOLS]["id"];

export { type ExtractedLineCap, type ToolHandler, type ToolId, TOOLS };

/**
 * Drawing helpers
 */

function drawInitShape(ctx: CanvasRenderingContext2D, point: Point) {
  const { x, y } = point;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

/**
 * DRAWING STATE
 * used to track drawing state for more complex shapes. dont mutate in directly, only via functions.
 */

type Temp = {
  startPoint: Point;
  savedImageData: ImageData | null;
};

let __startPoint__: Point = { x: 0, y: 0 };
let __savedImageData__: ImageData | null = null;

function createTemp(ctx: CanvasRenderingContext2D, point: Point) {
  __startPoint__ = { ...point };
  __savedImageData__ = ctx.getImageData(
    0,
    0,
    ctx.canvas.width,
    ctx.canvas.height,
  );
}

function getTemp(): Temp {
  return {
    startPoint: __startPoint__,
    savedImageData: __savedImageData__,
  };
}

function clearTemp(): void {
  __startPoint__ = { x: 0, y: 0 };
  __savedImageData__ = null;
}
