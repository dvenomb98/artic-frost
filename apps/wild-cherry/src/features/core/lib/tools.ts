import {FREE_HAND, FreeHandId} from "./tools/free-hand";
import {STRAIGHT_LINE, StraightLineId} from "./tools/straight-line";
import {PAINT_BUCKET, PaintBucketId} from "./tools/pain-bucket";
import {SQUARE_SHAPE, SquareShapeId} from "./tools/square-shape";
import {CIRCLE_SHAPE, CircleShapeId} from "./tools/circle-shape";
import {SELECTION, SelectionId} from "./tools/selection";
import {Tool} from "./tools/types";

type ToolId =
  | FreeHandId
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
  STRAIGHT_LINE,
  PAINT_BUCKET,
  SQUARE_SHAPE,
  CIRCLE_SHAPE,
  SELECTION,
} as const satisfies Tools;

export {type ToolId, TOOLS};
