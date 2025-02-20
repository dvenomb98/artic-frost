import { Paintbrush, Pencil } from "lucide-react";
import { CherryState } from "../store/store";

import { Point } from "./types";

type State = Pick<CherryState, "line_width" | "line_color">;

type ToolHandler = {
  onMouseDown: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    state: State
  ) => void;
  onMouseMove: (
    ctx: CanvasRenderingContext2D,
    point: Point,
    state: State
  ) => void;
  onMouseUp: (ctx: CanvasRenderingContext2D, state: State) => void;
  onMouseLeave: (ctx: CanvasRenderingContext2D, state: State) => void;
};

const TOOLS = {
  FREE_HAND: {
    id: "FREE_HAND",
    icon: Pencil,
    handler: {
      onMouseDown: (ctx, point, state) => {
        const { x, y } = point;
        const { line_width, line_color } = state;

        ctx.beginPath();
        ctx.arc(x, y, line_width / 2, 0, Math.PI * 2);
        ctx.fillStyle = line_color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = line_color;
        ctx.lineWidth = line_width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      },
      onMouseMove: (ctx, point) => {
        const { x, y } = point;

        ctx.lineTo(x, y);
        ctx.stroke();
      },
      onMouseUp: () => {},
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
  PAINT_BRUSH: {
    id: "PAINT_BRUSH",
    icon: Paintbrush,
    handler: {
      onMouseDown: (ctx, point, state) => {},
      onMouseMove: (ctx, point, state) => {},
      onMouseUp: () => {},
      onMouseLeave: () => {},
    } satisfies ToolHandler,
  },
} as const;

type ToolId = (typeof TOOLS)[keyof typeof TOOLS]["id"];

export { type ToolHandler, type ToolId, TOOLS };
