import {type CoreNode} from "../store/store";
import {HIGHLIGHT_OFFSET, setHighlightProperties} from "./theme";

import {startEndPointsFromNode, setCtxProperties} from "./utils";

function drawNodes(ctx: CanvasRenderingContext2D, nodes: CoreNode[]) {
  for (const node of nodes) {
    drawNode(ctx, node);
  }
}

function drawNode(
  ctx: CanvasRenderingContext2D,
  node: CoreNode,
  rewriteProperties: boolean = true
) {
  if (!node.points.length) {
    throw new Error("drawNode: node has no points");
  }
  if (rewriteProperties) {
    ctx.save();
    setCtxProperties(ctx, node.properties);
  }

  switch (node.type) {
    case "line": {
      drawLine(ctx, node);
      break;
    }

    case "rectangle": {
      drawRectangle(ctx, node);
      break;
    }
  }

  if (rewriteProperties) {
    ctx.restore();
  }
}

export {drawNodes, drawNode};

function drawLine(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {startPoint, endPoint} = startEndPointsFromNode(node);

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();

  if (node.highlight) {
    setHighlightProperties(ctx);
    const offset = HIGHLIGHT_OFFSET + 2;
    ctx.beginPath();
    ctx.roundRect(
      startPoint.x - offset,
      startPoint.y - offset,
      endPoint.x - startPoint.x + offset * 2,
      endPoint.y - startPoint.y + offset * 2,
      node.properties.borderRadius
    );
    ctx.stroke();
  }
}

function drawRectangle(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {startPoint, endPoint} = startEndPointsFromNode(node);

  const minX = Math.min(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const maxY = Math.max(startPoint.y, endPoint.y);
  const width = maxX - minX;
  const height = maxY - minY;

  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, node.properties.borderRadius);

  fillShape(ctx, node);

  if (node.highlight) {
    setHighlightProperties(ctx);
    ctx.beginPath();
    ctx.roundRect(
      minX - HIGHLIGHT_OFFSET,
      minY - HIGHLIGHT_OFFSET,
      width + HIGHLIGHT_OFFSET * 2,
      height + HIGHLIGHT_OFFSET * 2,
      node.properties.borderRadius
    );
    ctx.stroke();
  }
}

function fillShape(ctx: CanvasRenderingContext2D, node: CoreNode) {
  switch (node.properties.shapeOption) {
    case "fill_only": {
      ctx.fill();
      break;
    }

    case "fill_and_stroke": {
      ctx.fill();
      ctx.stroke();
      break;
    }

    case "stroke_and_transparent": {
      ctx.stroke();
      break;
    }

    default: {
      throw new Error("fillShape: invalid shape option");
    }
  }
}
