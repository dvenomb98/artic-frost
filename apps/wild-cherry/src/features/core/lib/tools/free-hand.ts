import {Pencil} from "lucide-react";
import {drawInitShape} from "../draw";
import {Tool, ToolHandler} from "./types";

const FREE_HAND = {
  id: "FREE_HAND",
  icon: Pencil,
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
} satisfies Tool<FreeHandId>;

type FreeHandId = "FREE_HAND";

export {FREE_HAND, type FreeHandId};
