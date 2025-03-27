import {FC} from "react";
import {TempShape} from "../../store/store";
import {Point} from "../types";

type ToolHandler = {
  onMouseDown: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseMove: (ctx: CanvasRenderingContext2D, point: Point) => void;
  onMouseUp: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    addShape: (shape: TempShape) => void
  ) => void;
  onMouseLeave: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    addShape: (shape: TempShape) => void
  ) => void;
};

type Tool<T> = {
  id: T;
  handler: ToolHandler;
  icon: FC;
};

export {type ToolHandler, type Tool};
