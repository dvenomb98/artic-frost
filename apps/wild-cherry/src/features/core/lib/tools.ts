import { Minus, Paintbrush, PaintBucket, Pencil } from "lucide-react";
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
      onMouseUp: () => {},
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
      onMouseMove: (_, point) => {
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
  PAINT_BUCKET: {
    id: "PAINT_BUCKET",
    icon: PaintBucket,
    handler: {
      onMouseDown: (ctx, point) => {
        const { x, y } = point;
        floodFill(ctx, x, y, ctx.fillStyle);
      },
      onMouseMove: () => {},
      onMouseUp: () => {},
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
} as const;

type ToolId = (typeof TOOLS)[keyof typeof TOOLS]["id"];

export { type ExtractedLineCap, type ToolHandler, type ToolId, TOOLS };

/*
 * Drawing helpers
 */

function drawInitShape(ctx: CanvasRenderingContext2D, point: Point) {
  const { x, y } = point;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

/*
 * Flood fill
 */

function rgbaToUint32(r: number, g: number, b: number, a: number) {
  return ((a << 24) | (b << 16) | (g << 8) | r) >>> 0;
}

function getFillColorAsUint32(color: string | CanvasGradient | CanvasPattern) {
  const c = document.createElement("canvas");
  c.width = c.height = 1;
  const ctx = getCtx(c);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const data = ctx.getImageData(0, 0, 1, 1).data;
  // typescript is being actually bitch here
  const [r, g, b, a] = [data[0]!, data[1]!, data[2]!, data[3]!];
  return rgbaToUint32(r, g, b, a);
}

function floodFill(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  fillColor: string | CanvasGradient | CanvasPattern
) {
  const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
  const uint32array = new Uint32Array(imageData.data.buffer);
  const color = getFillColorAsUint32(fillColor);
  const width = ctx.canvas.width;
  const height = ctx.canvas.height;
  const origin = uint32array[y * width + x];

  if (!origin)
    throw new Error("Origin not found. You are probably outside of canvas.");

  if (color === origin) return;

  const queue: [number, number][] = [[x, y]];

  while (queue.length > 0) {
    const [currentX, currentY] = queue.shift()!;
    const index = currentY * width + currentX;

    if (
      currentX < 0 ||
      currentY < 0 ||
      currentX >= width ||
      currentY >= height ||
      uint32array[index] !== origin
    ) {
      continue;
    }

    uint32array[index] = color;

    queue.push([currentX + 1, currentY]);
    queue.push([currentX - 1, currentY]);
    queue.push([currentX, currentY + 1]);
    queue.push([currentX, currentY - 1]);
  }

  const uint8ClampedArray = new Uint8ClampedArray(uint32array.buffer);
  const newImage = new ImageData(uint8ClampedArray, width);
  ctx.putImageData(newImage, 0, 0);
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

  if (!__tempCtx__) {
    throw new Error("You probably forgot to call createTemp first!");
  }

  __tempCtx__.clearRect(
    0,
    0,
    __tempCtx__.canvas.width,
    __tempCtx__.canvas.height
  );
  __tempCtx__.canvas.style.display = "none";
}
