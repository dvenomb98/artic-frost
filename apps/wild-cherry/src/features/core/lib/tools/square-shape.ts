import {toolHandler} from "./handler";
import {Tool} from "./types";
import {Square} from "lucide-react";

const SQUARE_SHAPE = {
  id: "SQUARE_SHAPE",
  icon: Square,
  handler: toolHandler("SQUARE_SHAPE"),
} satisfies Tool<SquareShapeId>;

type SquareShapeId = "SQUARE_SHAPE";

export {SQUARE_SHAPE, type SquareShapeId};
