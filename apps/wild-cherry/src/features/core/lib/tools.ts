import { Minus, Paintbrush, Pencil } from "lucide-react";
import { Point } from "./types";
import { getCtx, restoreCanvasState, saveCanvasState } from "./utils";
import { TEMP_CANVAS_ID } from "../modules/canvas/lib/config";

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
      onMouseUp: (ctx, point) => {},
      onMouseLeave: (ctx, point) => {
        const { x, y } = point;
        ctx.lineTo(x, y);
        ctx.stroke();
      },
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
      onMouseUp: () => {},
      onMouseLeave: (ctx, point) => {
        const { x, y } = point;
        ctx.lineTo(x, y);
        ctx.stroke();
      },
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
        const { startPoint, tempCtx } = getTemp();
        const { x, y } = point;

        tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
        tempCtx.beginPath();
        tempCtx.moveTo(startPoint.x, startPoint.y);
        tempCtx.lineTo(x, y);
        tempCtx.stroke();
      },
      onMouseUp: (ctx, point) => {
        const { startPoint } = getTemp();
        const { x, y } = point;

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

        clearTemp();
      },
      onMouseLeave: (ctx, point) => {
        const { startPoint } = getTemp();
        const { x, y } = point;

        ctx.beginPath();
        ctx.moveTo(startPoint.x, startPoint.y);
        ctx.lineTo(x, y);
        ctx.stroke();

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

let __startPoint__: Point = { x: 0, y: 0 };
let __tempCtx__: CanvasRenderingContext2D | null = null;

function createTemp(ctx: CanvasRenderingContext2D, point: Point) {
  __startPoint__ = { ...point };

  const isInitialized = !!__tempCtx__;

  const temp = __tempCtx__
    ? __tempCtx__
    : getCtx(document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement);

  if (!isInitialized) __tempCtx__ = temp;

  const copyState = saveCanvasState(ctx);

  temp.canvas.width = ctx.canvas.width;
  temp.canvas.height = ctx.canvas.height;
  temp.canvas.style.display = "block";

  restoreCanvasState(temp, copyState);
}

function getTemp() {
  if (!__tempCtx__) {
    throw new Error("You probably forgot to call createTemp first!");
  }

  return {
    startPoint: __startPoint__,
    tempCtx: __tempCtx__,
  };
}

function clearTemp(): void {
  __startPoint__ = { x: 0, y: 0 };

  if (!__tempCtx__)
    throw new Error("You probably forgot to call createTemp first!");

  __tempCtx__.clearRect(
    0,
    0,
    __tempCtx__.canvas.width,
    __tempCtx__.canvas.height
  );
  __tempCtx__.canvas.style.display = "none";
}
