import {CoreNode} from "../store/store";
import {Point} from "./types";
import {pointsFromNode} from "./utils";

const HIT_THRESHOLD = 5;

function isPointInsideOrOnBox(point: Point, node: CoreNode): boolean {
  const {startPoint, endPoint} = pointsFromNode(node);
  const minX = Math.min(startPoint.x, endPoint.x);
  const maxX = Math.max(startPoint.x, endPoint.x);
  const minY = Math.min(startPoint.y, endPoint.y);
  const maxY = Math.max(startPoint.y, endPoint.y);

  if (point.x > minX && point.x < maxX && point.y > minY && point.y < maxY) {
    return true;
  }

  if (
    point.x >= minX - HIT_THRESHOLD &&
    point.x <= maxX + HIT_THRESHOLD &&
    (Math.abs(point.y - minY) <= HIT_THRESHOLD ||
      Math.abs(point.y - maxY) <= HIT_THRESHOLD)
  ) {
    return true;
  }

  if (
    point.y >= minY - HIT_THRESHOLD &&
    point.y <= maxY + HIT_THRESHOLD &&
    (Math.abs(point.x - minX) <= HIT_THRESHOLD ||
      Math.abs(point.x - maxX) <= HIT_THRESHOLD)
  ) {
    return true;
  }

  return false;
}

function isPointOnLine(currentPoint: Point, node: CoreNode) {
  const {x, y} = currentPoint;
  const {startPoint, endPoint} = pointsFromNode(node);
  const {x: x1, y: y1} = startPoint;
  const {x: x2, y: y2} = endPoint;

  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  if (lineLength === 0) {
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
  }

  const t =
    ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (lineLength * lineLength);

  if (t < 0) {
    return Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2));
  }
  if (t > 1) {
    return Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2));
  }

  const projectionX = x1 + t * (x2 - x1);
  const projectionY = y1 + t * (y2 - y1);

  return (
    Math.sqrt(Math.pow(x - projectionX, 2) + Math.pow(y - projectionY, 2)) <
    HIT_THRESHOLD
  );
}

function getUpdatedPoints(
  node: CoreNode,
  currentPoint: Point
): CoreNode["points"] {
  const {startPoint} = pointsFromNode(node);

  const offsetX = currentPoint.x - startPoint.x;
  const offsetY = currentPoint.y - startPoint.y;

  const result = new Array(node.points.length);

  for (let i = 0; i < node.points.length; i++) {
    const p = node.points[i];
    // @ts-ignore
    result[i] = [p[0] + offsetX, p[1] + offsetY];
  }
  return result;
}

export {isPointInsideOrOnBox, isPointOnLine, getUpdatedPoints};
