import {FC} from "react";
import {Shape, TempShape} from "../../store/store";
import {Point} from "../types";

type ToolHandler = {
  onMouseDown: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    shapes: Shape[]
  ) => void;
  onMouseMove: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseUp: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    manageShape: (shape: TempShape, oldShape?: Shape) => Shape[]
  ) => void;
  onMouseLeave: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    manageShape: (shape: TempShape, oldShape?: Shape) => Shape[]
  ) => void;
};

type Tool<T> = {
  id: T;
  handler: ToolHandler;
  icon: FC;
};

export {type ToolHandler, type Tool};
