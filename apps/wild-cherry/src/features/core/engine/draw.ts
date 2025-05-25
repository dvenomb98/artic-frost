import {CoreFrame, type CoreNode} from "../store/store";
import {getMinMaxPoints} from "./collisions";
import {HIGHLIGHT_OFFSET, setHighlightProperties} from "./theme";

import {startEndPointsFromPoints, setCtxProperties} from "./utils";

function drawAll(
  ctx: CanvasRenderingContext2D,
  nodes: CoreNode[],
  frame: CoreFrame | null
) {
  if (frame) {
    drawFrame(ctx, frame);
  }

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

function drawFrame(
  ctx: CanvasRenderingContext2D,
  frame: CoreFrame,
  rewriteProperties: boolean = true
) {
  const {minX, maxX, minY, maxY} = getMinMaxPoints(frame.points);

  if (rewriteProperties) {
    ctx.save();
    setCtxProperties(ctx, frame.properties);
  }

  ctx.beginPath();
  ctx.roundRect(
    minX,
    minY,
    maxX - minX,
    maxY - minY,
    frame.properties.borderRadius
  );
  ctx.fill();
  ctx.stroke();
  ctx.closePath();

  if (rewriteProperties) {
    ctx.restore();
  }
}

export {drawNode, drawAll, drawFrame};

function drawLine(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {startX, startY, endX, endY} = startEndPointsFromPoints(node.points);

  ctx.beginPath();
  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);
  ctx.stroke();
  ctx.closePath();

  if (node.highlight) {
    setHighlightProperties(ctx);
    const offset = HIGHLIGHT_OFFSET + 2;
    ctx.beginPath();
    ctx.roundRect(
      startX - offset,
      startY - offset,
      endX - startX + offset * 2,
      endY - startY + offset * 2,
      node.properties.borderRadius
    );
    ctx.stroke();
    ctx.closePath();
  }
}

function drawRectangle(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {minX, maxX, minY, maxY} = getMinMaxPoints(node.points);
  const width = maxX - minX;
  const height = maxY - minY;

  ctx.beginPath();
  ctx.roundRect(minX, minY, width, height, node.properties.borderRadius);

  ctx.fill();
  ctx.stroke();
  ctx.closePath();

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
    ctx.closePath();
  }
}
