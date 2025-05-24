import {type CoreNode} from "../store/store";
import {getCanvasTheme} from "../store/utils";
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
  if (!node.points.length) {
    throw new Error("drawNode: node has no points");
  }
  if (rewriteProperties) {
    ctx.save();
    setCtxPropertiesFromNode(ctx, node.properties);
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

const HIGHLIGHT_OFFSET = 5;

function setHighlightProperties(ctx: CanvasRenderingContext2D) {
  const theme = getCanvasTheme();
  ctx.strokeStyle = theme.strokeStyle;
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
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

  if (node.highlight) {
    setHighlightProperties(ctx);
    ctx.beginPath();
    ctx.rect(
      startPoint.x - HIGHLIGHT_OFFSET,
      startPoint.y - HIGHLIGHT_OFFSET,
      endPoint.x - startPoint.x + HIGHLIGHT_OFFSET * 2,
      endPoint.y - startPoint.y + HIGHLIGHT_OFFSET * 2
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
