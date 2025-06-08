import {CoreNode} from "@core/store/store";
import {Point} from "../types";
import {isPointInside, getMinMaxPoints} from "./utils";

import {HIT_THRESHOLD} from "./const";

type HitType =
  | {type: "inside"; node: CoreNode}
  | {type: "edge"; node: CoreNode; edge: "top" | "bottom" | "left" | "right"}
  | {type: "control-point"; node: CoreNode; point: "start" | "end"}; // used for line nodes

function detectNodeCollision(
  point: Point,
  node: CoreNode,
  threshold: number = HIT_THRESHOLD
): HitType | null {
  switch (node.type) {
    case "rectangle":
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

function detectLineCollision(
  currentPoint: Point,
  node: CoreNode,
  threshold: number = HIT_THRESHOLD
): HitType | null {
  const minMax = getMinMaxPoints(node.points);
  const {minX, maxX, minY, maxY} = minMax;

  if (isPointInside(currentPoint, minMax, threshold)) {
    if (
      Math.sqrt(
        Math.pow(currentPoint.x - minX, 2) + Math.pow(currentPoint.y - minY, 2)
      ) <= threshold
    ) {
      return {type: "control-point", node, point: "start"};
    }

    if (
      Math.sqrt(
        Math.pow(currentPoint.x - maxX, 2) + Math.pow(currentPoint.y - maxY, 2)
      ) <= threshold
    ) {
      return {type: "control-point", node, point: "end"};
    }

    const midX = (minX + maxX) / 2;
    const midY = (minY + maxY) / 2;

    // if (
    //   Math.sqrt(
    //     Math.pow(currentPoint.x - midX, 2) + Math.pow(currentPoint.y - midY, 2)
    //   ) <= threshold
    // ) {
    //   return {type: "control-point", node, point: "middle"};
    // }

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
