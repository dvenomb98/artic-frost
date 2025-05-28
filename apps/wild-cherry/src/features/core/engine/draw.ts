import {CoreFrame, type CoreNode} from "../store/store";
import {getMinMaxPoints} from "./collisions/utils";
import {CameraManager, Camera} from "./managers";
import {
  generateGridProperties,
  GRID_SIZE,
  HIGHLIGHT_OFFSET,
  setHighlightProperties,
} from "./theme";

import {startEndPointsFromPoints, setCtxProperties} from "./utils";

function drawAll(
  ctx: CanvasRenderingContext2D,
  nodes: CoreNode[],
  frame: CoreFrame | null,
  grid: boolean = false,
  cameraManager: CameraManager
) {
  if (grid) {
    drawGrid(ctx, cameraManager.getCamera());
  }
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

function drawGrid(ctx: CanvasRenderingContext2D, camera: Camera) {
  ctx.save();
  setCtxProperties(ctx, generateGridProperties(camera));

  const startX =
    Math.floor((camera.x - ctx.canvas.width / 2 / camera.scale) / GRID_SIZE) *
    GRID_SIZE;
  const endX =
    Math.ceil((camera.x + ctx.canvas.width / 2 / camera.scale) / GRID_SIZE) *
    GRID_SIZE;
  const startY =
    Math.floor((camera.y - ctx.canvas.height / 2 / camera.scale) / GRID_SIZE) *
    GRID_SIZE;
  const endY =
    Math.ceil((camera.y + ctx.canvas.height / 2 / camera.scale) / GRID_SIZE) *
    GRID_SIZE;

  for (let x = startX; x <= endX; x += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(x, startY - GRID_SIZE);
    ctx.lineTo(x, endY + GRID_SIZE);
    ctx.stroke();
    ctx.closePath();
  }

  for (let y = startY; y <= endY; y += GRID_SIZE) {
    ctx.beginPath();
    ctx.moveTo(startX - GRID_SIZE, y);
    ctx.lineTo(endX + GRID_SIZE, y);
    ctx.stroke();
    ctx.closePath();
  }

  ctx.restore();
}

export {drawNode, drawAll, drawFrame, drawGrid};

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
