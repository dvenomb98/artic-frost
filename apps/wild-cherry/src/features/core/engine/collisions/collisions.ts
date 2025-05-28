import {CoreNode} from "@core/store/store";
import {Point} from "../types";
import {startEndPointsFromPoints} from "../utils";
import {isPointInside, getMinMaxPoints} from "./utils";

import {HIT_THRESHOLD} from "./const";

type HitType =
  | {type: "inside"; node: CoreNode}
  | {type: "edge"; node: CoreNode; edge: "top" | "bottom" | "left" | "right"};

function detectNodeCollision(
  point: Point,
  node: CoreNode,
  threshold: number = HIT_THRESHOLD
): HitType | null {
  switch (node.type) {
    case "rectangle":
      return detectRectangleCollision(point, node, threshold);
    case "line":
      return null;
    default:
      return null;
  }
}

function detectRectangleCollision(
  currentPoint: Point,
  node: CoreNode,
  threshold: number = HIT_THRESHOLD
): HitType | null {
  const minMax = getMinMaxPoints(node.points);
  const {minX, maxX, minY, maxY} = minMax;

  if (isPointInside(currentPoint, minMax, threshold)) {
    if (Math.abs(currentPoint.y - minY) <= threshold) {
      return {type: "edge", edge: "top", node};
    }
    if (Math.abs(currentPoint.y - maxY) <= threshold) {
      return {type: "edge", edge: "bottom", node};
    }
    if (Math.abs(currentPoint.x - minX) <= threshold) {
      return {type: "edge", edge: "left", node};
    }
    if (Math.abs(currentPoint.x - maxX) <= threshold) {
      return {type: "edge", edge: "right", node};
    }

    return {type: "inside", node};
  }

  return null;
}

function isPointOnLine(currentPoint: Point, node: CoreNode) {
  const {x, y} = currentPoint;
  const {
    startX: x1,
    startY: y1,
    endX: x2,
    endY: y2,
  } = startEndPointsFromPoints(node.points);

  const lineLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));

  const t =
    ((x - x1) * (x2 - x1) + (y - y1) * (y2 - y1)) / (lineLength * lineLength);

  if (t < 0) {
    return (
      Math.sqrt(Math.pow(x - x1, 2) + Math.pow(y - y1, 2)) <= HIT_THRESHOLD
    );
  }
  if (t > 1) {
    return (
      Math.sqrt(Math.pow(x - x2, 2) + Math.pow(y - y2, 2)) <= HIT_THRESHOLD
    );
  }

  const projectionX = x1 + t * (x2 - x1);
  const projectionY = y1 + t * (y2 - y1);

  return (
    Math.sqrt(Math.pow(x - projectionX, 2) + Math.pow(y - projectionY, 2)) <=
    HIT_THRESHOLD
  );
}

export {detectRectangleCollision, detectNodeCollision, type HitType};
