import {FREE_HAND, FreeHandId} from "./tools/free-hand";
import {PAINT_BRUSH, PaintBrushId} from "./tools/paint-brush";
import {STRAIGHT_LINE, StraightLineId} from "./tools/straight-line";
import {PAINT_BUCKET, PaintBucketId} from "./tools/pain-bucket";
import {SQUARE_SHAPE, SquareShapeId} from "./tools/square-shape";
import {CIRCLE_SHAPE, CircleShapeId} from "./tools/circle-shape";
import {SELECTION, SelectionId} from "./tools/selection";
import {FC} from "react";
import {Tool, ToolHandler} from "./tools/types";

type ToolId =
  | FreeHandId
  | PaintBrushId
  | StraightLineId
  | PaintBucketId
  | SquareShapeId
  | CircleShapeId
  | SelectionId;

type Tools = {
  [K in ToolId]: Tool<ToolId>;
};

const TOOLS = {
  FREE_HAND,
  PAINT_BRUSH,
  STRAIGHT_LINE,
  PAINT_BUCKET,
  SQUARE_SHAPE,
  CIRCLE_SHAPE,
  SELECTION,
} as const satisfies Tools;

export {type ToolId, TOOLS};
