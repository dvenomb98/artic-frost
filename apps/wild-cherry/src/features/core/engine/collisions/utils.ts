import {NodePointTuple} from "@core/store/store";
import {MinMaxPoints, Point} from "../types";
import {HIT_THRESHOLD} from "./const";

function isPointInside(
  currentPoint: Point,
  minMax: MinMaxPoints,
  threshold: number = HIT_THRESHOLD
) {
  const {minX, maxX, minY, maxY} = minMax;

  return (
    currentPoint.x >= minX - threshold &&
    currentPoint.x <= maxX + threshold &&
    currentPoint.y >= minY - threshold &&
    currentPoint.y <= maxY + threshold
  );
}

function getMinMaxPoints(points: NodePointTuple) {
  if (!points[1] || !points[0]) return {minX: 0, maxX: 0, minY: 0, maxY: 0};

  const [startX, startY] = points[0];
  const [endX, endY] = points[1];

  return {
    minX: Math.min(startX, endX),
    maxX: Math.max(startX, endX),
    minY: Math.min(startY, endY),
    maxY: Math.max(startY, endY),
  };
}

export {isPointInside, getMinMaxPoints};
