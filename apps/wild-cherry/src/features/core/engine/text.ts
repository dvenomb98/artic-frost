import {TCanvasKeyDownEvent} from "../lib/types";
import {CoreNode} from "../store/store";
import {GLOBAL_CONFIG} from "./const";
import {Point} from "./types";
import {setTextProperties} from "./utils";

function getCharFromEvent(e: TCanvasKeyDownEvent) {
  if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
    return e.key;
  }

  return null;
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  containerWidth: number,
  fontSize: number,
  node: CoreNode
) {
  if (!node || node.type !== "text") {
    throw new Error("wrapText: node is not a text");
  }

  // setting scoped context to precise the calculations.
  ctx.save();
  setTextProperties(ctx, node.textProperties, fontSize);

  const chars = text.split("");
  const lines = [];

  let currentLine = "";

  for (const char of chars) {
    const testLine = currentLine + char;
    const testWidth =
      ctx.measureText(testLine).width + GLOBAL_CONFIG.TEXT_NODE.PADDING_X;

    if (testWidth > containerWidth) {
      lines.push(currentLine);
      currentLine = char;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  ctx.restore();
  return lines;
}

function getAutoFittedFontSize(height: number, width: number) {
  return Math.min(width, height) / GLOBAL_CONFIG.TEXT_NODE.LINE_OFFSET;
}

function getInitialTextYPosition(fontSize: number, minY: number) {
  return minY + fontSize / GLOBAL_CONFIG.TEXT_NODE.LINE_OFFSET;
}

function getLineHeight(fontSize: number) {
  return fontSize * GLOBAL_CONFIG.TEXT_NODE.LINE_OFFSET;
}

function getNewNodeHeightToFitText(
  linesLength: number,
  fontSize: number,
  originalHeight: number
) {
  const calculatedHeight = linesLength * getLineHeight(fontSize);
  return Math.max(calculatedHeight, originalHeight);
}

function textNodePointsToFixedSize(point: Point, node: CoreNode) {
  const pointWithFixedHeight = {
    x: point.x,
    y: node.points[0][1] + GLOBAL_CONFIG.TEXT_NODE.DEFAULT_HEIGHT,
  };
  return pointWithFixedHeight;
}
export {
  getCharFromEvent,
  getAutoFittedFontSize,
  wrapText,
  getNewNodeHeightToFitText,
  getInitialTextYPosition,
  textNodePointsToFixedSize,
  getLineHeight,
};
