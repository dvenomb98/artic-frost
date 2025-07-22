import {CoreNode, NodePointTuple} from "../store/store";

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

function getRectanglePoints(node: CoreNode) {
  const {minX, maxX, minY, maxY} = getMinMaxPoints(node.points);
  const width = maxX - minX;
  const height = maxY - minY;

  return {minX, maxX, minY, maxY, width, height};
}

export {getMinMaxPoints, getRectanglePoints};
