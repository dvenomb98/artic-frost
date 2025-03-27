import {Paintbrush} from "lucide-react";
import {Tool, ToolHandler} from "./types";
import {drawInitShape} from "./draw";

const PAINT_BRUSH = {
  id: "PAINT_BRUSH",
  icon: Paintbrush,
  handler: {
    onMouseDown: (ctx, point) => {
      drawInitShape(ctx, point);
      const {x, y} = point;

      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    onMouseMove: (ctx, point) => {
      const {x, y} = point;

      ctx.lineTo(x, y);
      ctx.stroke();
    },
    onMouseUp: () => {},
    onMouseLeave: (ctx, point) => {
      const {x, y} = point;
      ctx.lineTo(x, y);
      ctx.stroke();
    },
  } satisfies ToolHandler,
} satisfies Tool<PaintBrushId>;

type PaintBrushId = "PAINT_BRUSH";

export {PAINT_BRUSH, type PaintBrushId};
