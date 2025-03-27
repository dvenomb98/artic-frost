import {MousePointerClick} from "lucide-react";
import {Tool, ToolHandler} from "./types";
import {Point} from "../types";

import {temp} from "./temp";
import {selectedShapeManager} from "./shapes";
import {drawStraightLine} from "./draw";
import {Shape} from "@core/store/store";
import {getCanvasState, restoreCanvasState} from "../utils";

const SELECTION = {
  id: "SELECTION",
  icon: MousePointerClick,
  handler: {
    onMouseDown: (ctx, point, shapes) => {
      const hit = shapes.find(s => {
        switch (s.type) {
          case "STRAIGHT_LINE":
            if (s.points.length !== 2 || !s.points[0] || !s.points[1]) {
              console.error("Straight line points does not have length 2!");
              return false;
            }

            const distance = pointToLineDistance(
              point,
              toPoint(s.points[0]),
              toPoint(s.points[1])
            );

            return distance <= HIT_THRESHOLD;
          default:
            return false;
        }
      });

      if (hit) {
        temp.create(ctx, point);
        selectedShapeManager.create(hit);
      }
    },
    onMouseMove: (ctx, point) => {
      const shape = selectedShapeManager.get();

      if (!shape) return;

      const {tempCtx, startPoint} = temp.get();

      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);

      const updatedPoints = getUpdatedPoints(shape, startPoint, point);

      switch (shape.type) {
        case "STRAIGHT_LINE":
          if (updatedPoints[0] && updatedPoints[1]) {
            drawStraightLine(
              tempCtx,
              toPoint(updatedPoints[0]),
              toPoint(updatedPoints[1]),
              shape.properties
            );
          }
          break;
      }
    },
    onMouseUp: (ctx, point, manageShape) => {
      const shape = selectedShapeManager.get();

      if (!shape) return;

      const {startPoint} = temp.get();

      const updatedPoints = getUpdatedPoints(shape, startPoint, point);

      const newShape = {
        id: shape.id,
        points: updatedPoints,
      };

      switch (shape.type) {
        case "STRAIGHT_LINE":
          if (updatedPoints[0] && updatedPoints[1]) {
            drawStraightLine(
              ctx,
              toPoint(updatedPoints[0]),
              toPoint(updatedPoints[1]),
              shape.properties
            );
          }
          break;
      }

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

function toPoint(point: number[]): Point {
  return {x: point[0] ?? 0, y: point[1] ?? 0};
}

function getUpdatedPoints(
  shape: any,
  startPoint: Point,
  currentPoint: Point
): number[][] {
  const offsetX = currentPoint.x - startPoint.x;
  const offsetY = currentPoint.y - startPoint.y;

  return shape.points.map((p: number[]) => {
    const {x, y} = toPoint(p);
    return [x + offsetX, y + offsetY];
  });
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

function redrawCanvasFromShapes(
  ctx: CanvasRenderingContext2D,
  shapes: Shape[]
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  for (const shape of shapes) {
    const originalState = getCanvasState(ctx);

    restoreCanvasState(ctx, {
      ...originalState,
      ...shape.properties,
    });

    switch (shape.type) {
      case "STRAIGHT_LINE":
        if (shape.points.length !== 2 || !shape.points[0] || !shape.points[1]) {
          console.error("Straight line points does not have length 2!");
          return;
        }

        drawStraightLine(
          ctx,
          toPoint(shape.points[0]),
          toPoint(shape.points[1]),
          shape.properties
        );

        break;
    }

    restoreCanvasState(ctx, originalState);
  }
}
