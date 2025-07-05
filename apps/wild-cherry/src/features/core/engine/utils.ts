import {LOGGER} from "@/lib/logger";
import {
  CoreProperties,
  CoreTextProperties,
  NodePointTuple,
} from "../store/store";
import {CANVAS_CSS_PROPERTIES, getCssColor} from "./theme";

function startEndPointsFromPoints(points: NodePointTuple) {
  const l = points.length;
  if (l < 2) {
    throw new Error(
      `startEndPointsFromNode: node must have at least 2 points, got ${l}`
    );
  }

  const startX = points[0][0];
  const startY = points[0][1];

  const endX = points[l - 1]![0];
  const endY = points[l - 1]![1];

  return {startX, startY, endX, endY};
}

function setCtxProperties(
  ctx: CanvasRenderingContext2D,
  properties: Partial<CoreProperties>
) {
  if (!properties) return;

  if (properties.fillStyle) {
    ctx.fillStyle = properties.fillStyle;
  }
  if (properties.strokeStyle) {
    ctx.strokeStyle = properties.strokeStyle;
  }
  if (properties.lineWidth) {
    ctx.lineWidth = properties.lineWidth;
  }
  if (properties.lineCap) {
    ctx.lineCap = properties.lineCap;
  }
  if (properties.lineJoin) {
    ctx.lineJoin = properties.lineJoin;
  }
  if (properties.lineDash) {
    ctx.setLineDash(properties.lineDash);
  }
}

function setHighlightProperties(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = getCssColor(CANVAS_CSS_PROPERTIES.HIGHLIGHT);
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
}

function setTextProperties(
  ctx: CanvasRenderingContext2D,
  properties: CoreTextProperties
) {
  ctx.fillStyle = properties.color;
  ctx.font = properties.fontSize + " " + properties.fontFamily;
  ctx.textAlign = properties.textAlign;
  ctx.textBaseline = properties.textBaseline;
}

function verifyPerformance(callback: () => void, name: string) {
  const start = performance.now();
  callback();
  const end = performance.now();
  if (end - start > 16) {
    LOGGER.warn(`Slow render: ${name} took ${end - start}ms`);
  }
}

export {
  startEndPointsFromPoints,
  setCtxProperties,
  setTextProperties,
  setHighlightProperties,
  verifyPerformance,
};
