import {CoreNode} from "../store/store";
import {Point} from "./types";

function pointToXY(point: number[]) {
  return {
    x: point[0] || 0,
    y: point[1] || 0,
  };
}

function pointsFromNode(node: CoreNode) {
  const startPoint = pointToXY(node.points[0] || []);
  const endPoint = pointToXY(node.points[1] || []);

  return {startPoint, endPoint};
}

function setCtxProperties(
  ctx: CanvasRenderingContext2D,
  properties?: Partial<CoreNode["properties"]>
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
}

function getUpdatedPoints(
  node: CoreNode,
  currentPoint: Point,
  initialMousePosition: Point
) {
  const offsetX = currentPoint.x - initialMousePosition.x;
  const offsetY = currentPoint.y - initialMousePosition.y;

  const result = new Array(node.points.length);

  for (let i = 0; i < node.points.length; i++) {
    const p = node.points[i];
    // @ts-ignore
    result[i] = [p[0] + offsetX, p[1] + offsetY];
  }
  return result;
}

export {pointsFromNode, pointToXY, setCtxProperties, getUpdatedPoints};
