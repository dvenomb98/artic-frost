import {Circle} from "lucide-react";
import {Tool} from "./types";
import {toolHandler} from "./handler";

const CIRCLE_SHAPE = {
  id: "CIRCLE_SHAPE",
  icon: Circle,
  handler: toolHandler("CIRCLE_SHAPE"),
} satisfies Tool<CircleShapeId>;

type CircleShapeId = "CIRCLE_SHAPE";

export {CIRCLE_SHAPE, type CircleShapeId};
