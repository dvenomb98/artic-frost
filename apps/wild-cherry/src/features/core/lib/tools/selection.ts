import {MousePointerClick} from "lucide-react";
import {Shape} from "@core/store/store";

import {Tool, ToolHandler} from "./types";
import {Point} from "../types";

import {temp} from "./temp";
import {selectedShapeManager} from "./shapes";

import {
  drawCircle,
  drawFreeHand,
  drawRect,
  drawStraightLine,
  redrawCanvasFromShapes,
} from "../draw";

import {toPoint} from "../utils";

const SELECTION = {
  id: "SELECTION",
  icon: MousePointerClick,
  handler: {
    onMouseDown: (ctx, point, shapes) => {
      const hit = shapes.find(s => {
        if (!s.points[0] || !s.points[1]) {
          console.log("Invalid points founded onMouseMove!", s);
          return false;
        }

        switch (s.type) {
          case "STRAIGHT_LINE": {
            const distance = pointToLineDistance(
              point,
              toPoint(s.points[0]),
              toPoint(s.points[1])
            );

            return distance <= HIT_THRESHOLD;
          }
          case "SQUARE_SHAPE": {
            return isPointInsideOrOnBox(
              point,
              toPoint(s.points[0]),
              toPoint(s.points[1])
            );
          }
          case "CIRCLE_SHAPE": {
            return isPointInsideOrOnBox(
              point,
              toPoint(s.points[0]),
              toPoint(s.points[1])
            );
          }
          case "FREE_HAND": {
            for (let i = 0; i < s.points.length - 1; i++) {
              const distance = pointToLineDistance(
                point,
                toPoint(s.points[i]!),
                toPoint(s.points[i + 1]!)
              );

              if (distance <= HIT_THRESHOLD) {
                return true;
              }
            }
            return false;
          }
          default:
            return false;
        }
      });

      if (hit) {
        temp.create(ctx, point);
        selectedShapeManager.create(hit);
      }
    },
    onMouseMove: (_, point) => {
      const shape = selectedShapeManager.get();

      if (!shape) return;

      const {tempCtx, startPoint} = temp.get();

      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);

      const updatedPoints = getUpdatedPoints(shape, startPoint, point);

      if (!updatedPoints[0] || !updatedPoints[1]) {
        console.log(
          "Invalid points founded onMouseMove!",
          updatedPoints,
          shape
        );
        return;
      }

      switch (shape.type) {
        case "STRAIGHT_LINE": {
          drawStraightLine(
            tempCtx,
            toPoint(updatedPoints[0]),
            toPoint(updatedPoints[1]),
            shape.properties
          );

          break;
        }
        case "SQUARE_SHAPE": {
          drawRect(
            tempCtx,
            toPoint(updatedPoints[0]),
            toPoint(updatedPoints[1]),
            shape.properties
          );

          break;
        }
        case "CIRCLE_SHAPE": {
          drawCircle(
            tempCtx,
            toPoint(updatedPoints[0]),
            toPoint(updatedPoints[1]),
            shape.properties
          );
          break;
        }
        case "FREE_HAND": {
          tempCtx.beginPath();
          const {x, y} = toPoint(updatedPoints[0]);
          tempCtx.moveTo(x, y);
          for (const point of updatedPoints) {
            drawFreeHand(tempCtx, toPoint(point), shape.properties);
          }
          break;
        }
      }
    },
    onMouseUp: (ctx, point, manageShape) => {
      const shape = selectedShapeManager.get();

      if (!shape) return;

      const {startPoint} = temp.get();

      const newShape = {
        id: shape.id,
        points: getUpdatedPoints(shape, startPoint, point),
      };

      const newShapes = manageShape(newShape, shape);
      redrawCanvasFromShapes(ctx, newShapes);

      selectedShapeManager.clear();
      temp.clear();
    },
    onMouseLeave: () => {
      selectedShapeManager.clear();
      temp.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<SelectionId>;

type SelectionId = "SELECTION";

export {SELECTION, type SelectionId};

const HIT_THRESHOLD = 5;

function getUpdatedPoints(
  shape: any,
  startPoint: Point,
  currentPoint: Point
): number[][] {
  const offsetX = currentPoint.x - startPoint.x;
  const offsetY = currentPoint.y - startPoint.y;

  const result = new Array(shape.points.length);

  for (let i = 0; i < shape.points.length; i++) {
    const p = shape.points[i];
    result[i] = [p[0] + offsetX, p[1] + offsetY];
  }
  return result;
}

function isPointInsideOrOnBox(
  point: Point,
  corner1: Point,
  corner2: Point
): boolean {
  const minX = Math.min(corner1.x, corner2.x);
  const maxX = Math.max(corner1.x, corner2.x);
  const minY = Math.min(corner1.y, corner2.y);
  const maxY = Math.max(corner1.y, corner2.y);

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

function pointToLineDistance(
  point: Point,
  lineStart: Point,
  lineEnd: Point
): number {
  const {x, y} = point;
  const {x: x1, y: y1} = lineStart;
  const {x: x2, y: y2} = lineEnd;

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

  return Math.sqrt(Math.pow(x - projectionX, 2) + Math.pow(y - projectionY, 2));
}
