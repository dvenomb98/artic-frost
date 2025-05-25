import {CoreNode, NodePointTuple} from "@core/store/store";
import {MinMaxPoints, Point} from "./types";
import {startEndPointsFromPoints} from "./utils";

const HIT_THRESHOLD = 20;

function isPointInsideOrOnBox(point: Point, node: CoreNode): boolean {
  const minMax = getMinMaxPoints(node.points);

  if (isPointInside(point, minMax)) return true;

  const {minX, maxX, minY, maxY} = minMax;

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

function isPointInside(currentPoint: Point, minMax: MinMaxPoints) {
  const {minX, maxX, minY, maxY} = minMax;

  return (
    currentPoint.x >= minX &&
    currentPoint.x <= maxX &&
    currentPoint.y >= minY &&
    currentPoint.y <= maxY
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

export {isPointInsideOrOnBox, isPointOnLine, isPointInside, getMinMaxPoints};
