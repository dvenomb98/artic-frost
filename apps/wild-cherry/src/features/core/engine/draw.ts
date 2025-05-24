import {type CoreNode} from "../store/store";
import {pointsFromNode, pointToXY, setCtxPropertiesFromNode} from "./utils";

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
  if (!node.points[0]) {
    throw new Error("drawNode: node has no points or first point is not set.");
  }
  if (rewriteProperties) {
    ctx.save();
    setCtxPropertiesFromNode(ctx, node.properties);
  }

  if (!node.points[1]) {
    drawInitShape(ctx, node);
  } else {
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
  }

  if (rewriteProperties) {
    ctx.restore();
  }
}

export {drawNodes, drawNode};

function drawInitShape(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const point = pointToXY(node.points[0] || []);

  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.stroke();
}

function drawLine(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {startPoint, endPoint} = pointsFromNode(node);

  ctx.beginPath();
  ctx.moveTo(startPoint.x, startPoint.y);
  ctx.lineTo(endPoint.x, endPoint.y);
  ctx.stroke();
}

function drawRectangle(ctx: CanvasRenderingContext2D, node: CoreNode) {
  const {startPoint, endPoint} = pointsFromNode(node);

  ctx.beginPath();
  ctx.rect(
    startPoint.x,
    startPoint.y,
    endPoint.x - startPoint.x,
    endPoint.y - startPoint.y
  );

  fillShape(ctx, node);
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
