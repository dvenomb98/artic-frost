import {CoreNode} from "@core/store/store";
import {Point} from "../types";
import {isPointInside} from "./utils";
import {getMinMaxPoints} from "../math";

import {GLOBAL_CONFIG} from "../const";

type HitType =
  | {type: "inside"; node: CoreNode}
  | {type: "edge"; node: CoreNode; edge: "top" | "bottom" | "left" | "right"}
  | {type: "control-point"; node: CoreNode; point: "start" | "end"}; // used for line nodes

function detectNodeCollision(
  point: Point,
  node: CoreNode,
  threshold: number = GLOBAL_CONFIG.HIT_THRESHOLD
): HitType | null {
  switch (node.type) {
    case "rectangle":
    case "text":
      return detectRectangleCollision(point, node, threshold);
    case "line":
      return detectLineCollision(point, node, threshold);
    default:
      return null;
  }
}

function detectRectangleCollision(
  currentPoint: Point,
  node: CoreNode,
  threshold: number = GLOBAL_CONFIG.HIT_THRESHOLD
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

function detectLineCollision(
  currentPoint: Point,
  node: CoreNode,
  threshold: number = GLOBAL_CONFIG.HIT_THRESHOLD
): HitType | null {
  const minMax = getMinMaxPoints(node.points);

  const startPoint = node.points[0];
  const endPoint = node.points[1];

  if (!startPoint || !endPoint) {
    return null;
  }

  const [startX, startY] = startPoint;
  const [endX, endY] = endPoint;

  if (isPointInside(currentPoint, minMax, threshold)) {
    if (
      Math.sqrt(
        Math.pow(currentPoint.x - startX, 2) +
          Math.pow(currentPoint.y - startY, 2)
      ) <= threshold
    ) {
      return {type: "control-point", node, point: "start"};
    }

    if (
      Math.sqrt(
        Math.pow(currentPoint.x - endX, 2) + Math.pow(currentPoint.y - endY, 2)
      ) <= threshold
    ) {
      return {type: "control-point", node, point: "end"};
    }

    return {type: "inside", node};
  }

  return null;
}

export {
  detectRectangleCollision,
  detectNodeCollision,
  detectLineCollision,
  type HitType,
};
