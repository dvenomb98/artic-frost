import {CanvasContextProps, Shape} from "@core/store/store";
import {Point} from "../types";
import {getCanvasState, getCtx, restoreCanvasState, toPoint} from "../utils";

function drawInitShape(ctx: CanvasRenderingContext2D, point: Point) {
  const {x, y} = point;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y);
  ctx.stroke();
}

function fillShape(ctx: CanvasRenderingContext2D) {
  switch (ctx._ext_shapeOption) {
    case "stroke_and_transparent": {
      ctx.stroke();
      break;
    }
    case "fill_only": {
      ctx.fill();
      break;
    }
    case "stroke_and_fill": {
      ctx.stroke();
      ctx.fill();
      break;
    }
  }
}

function drawRect(
  ctx: CanvasRenderingContext2D,
  start: Point,
  point: Point,
  properties?: Partial<CanvasContextProps>
) {
  const {x, y} = point;

  let state = null;

  if (properties) {
    state = getCanvasState(ctx);
    restoreCanvasState(ctx, {...state, ...(properties ?? {})});
  }

  ctx.beginPath();
  ctx.moveTo(start.x, start.y);
  ctx.lineTo(x, start.y);
  ctx.lineTo(x, y);
  ctx.lineTo(start.x, y);
  ctx.lineTo(start.x, start.y);

  fillShape(ctx);

  if (state) {
    restoreCanvasState(ctx, state);
  }
}

function drawCircle(
  ctx: CanvasRenderingContext2D,
  start: Point,
  point: Point,
  properties?: Partial<CanvasContextProps>
) {
  let state = null;

  if (properties) {
    state = getCanvasState(ctx);
    restoreCanvasState(ctx, {...state, ...(properties ?? {})});
  }

  const centerX = (start.x + point.x) / 2;
  const centerY = (start.y + point.y) / 2;

  const radius =
    Math.sqrt(Math.pow(point.x - start.x, 2) + Math.pow(point.y - start.y, 2)) /
    2;

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);

  fillShape(ctx);

  if (state) {
    restoreCanvasState(ctx, state);
  }
}

function drawFreeHand(
  ctx: CanvasRenderingContext2D,
  points: Point,
  properties?: Partial<CanvasContextProps>
) {
  let state = null;

  if (properties) {
    state = getCanvasState(ctx);
    restoreCanvasState(ctx, {...state, ...(properties ?? {})});
  }

  ctx.lineTo(points.x, points.y);
  ctx.stroke();

  if (state) {
    restoreCanvasState(ctx, state);
  }
}

function drawStraightLine(
  ctx: CanvasRenderingContext2D,
  startPoint: Point,
  endPoint: Point,
  properties?: Partial<CanvasContextProps>
) {
  let state = null;

  if (properties) {
    state = getCanvasState(ctx);
    restoreCanvasState(ctx, {...state, ...(properties ?? {})});
  }

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();

  if (state) {
    restoreCanvasState(ctx, state);
  }
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

  if (!origin) {
    throw new Error("Origin not found. You are probably outside of canvas.");
  }

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

function redrawCanvasFromShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[]
) {
  // TODO: keep original bg etc.
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const shape of shapes) {
    if (!shape.points[0] || !shape.points[1]) {
      console.error("Invalid points founded on redrawCanvasFromShapes!", shape);
      return;
    }

    const originalState = getCanvasState(ctx);

    restoreCanvasState(ctx, {
      ...originalState,
      ...shape.properties,
    });

    switch (shape.type) {
      case "STRAIGHT_LINE":
        drawStraightLine(
          ctx,
          toPoint(shape.points[0]),
          toPoint(shape.points[1]),
          shape.properties
        );
        break;
      case "SQUARE_SHAPE": {
        drawRect(
          ctx,
          toPoint(shape.points[0]),
          toPoint(shape.points[1]),
          shape.properties
        );
        break;
      }
      case "CIRCLE_SHAPE": {
        drawCircle(
          ctx,
          toPoint(shape.points[0]),
          toPoint(shape.points[1]),
          shape.properties
        );
        break;
      }
      case "FREE_HAND": {
        ctx.beginPath();
        ctx.moveTo(shape.points[0][0]!, shape.points[0][1]!);
        for (const point of shape.points) {
          drawFreeHand(ctx, toPoint(point), shape.properties);
        }
        break;
      }
    }

    restoreCanvasState(ctx, originalState);
  }
}

export {
  drawInitShape,
  drawCircle,
  drawFreeHand,
  drawRect,
  fillShape,
  floodFill,
  drawStraightLine,
  redrawCanvasFromShapes,
};

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
