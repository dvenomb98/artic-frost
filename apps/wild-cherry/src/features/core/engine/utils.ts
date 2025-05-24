import {CoreNode} from "../store/store";

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

function setCtxPropertiesFromNode(
  ctx: CanvasRenderingContext2D,
  nodeProperties: CoreNode["properties"]
) {
  ctx.fillStyle = nodeProperties.fillStyle;
  ctx.strokeStyle = nodeProperties.strokeStyle;
  ctx.lineWidth = nodeProperties.lineWidth;
  ctx.lineCap = nodeProperties.lineCap;
}

export {pointsFromNode, pointToXY, setCtxPropertiesFromNode};
