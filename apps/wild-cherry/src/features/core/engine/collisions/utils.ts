import {MinMaxPoints, Point} from "../types";
import {GLOBAL_CONFIG} from "../const";

function isPointInside(
  currentPoint: Point,
  minMax: MinMaxPoints,
  threshold: number = GLOBAL_CONFIG.HIT_THRESHOLD
) {
  const {minX, maxX, minY, maxY} = minMax;

  return (
    currentPoint.x >= minX - threshold &&
    currentPoint.x <= maxX + threshold &&
    currentPoint.y >= minY - threshold &&
    currentPoint.y <= maxY + threshold
  );
}



export {isPointInside};
