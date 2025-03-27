import {Pencil} from "lucide-react";
import {drawFreeHand, drawInitShape} from "./draw";
import {Tool, ToolHandler} from "./types";
import {shapeManager} from "./shapes";
const FREE_HAND = {
  id: "FREE_HAND",
  icon: Pencil,
  handler: {
    onMouseDown: (ctx, point) => {
      drawInitShape(ctx, point);
      const {x, y} = point;

      ctx.beginPath();
      ctx.moveTo(x, y);

      shapeManager.create({points: [[x, y]]});
    },
    onMouseMove: (ctx, point) => {
      const {x, y} = point;

      drawFreeHand(ctx, point);
      shapeManager.addPoint([x, y]);
    },
    onMouseUp: (_ctx, _point, manageShape) => {
      manageShape(shapeManager.get());
      shapeManager.clear();
    },
    onMouseLeave: (ctx, point, manageShape) => {
      const {x, y} = point;
      drawFreeHand(ctx, point);
      shapeManager.addPoint([x, y]);
      manageShape(shapeManager.get());
      shapeManager.clear();
    },
  } satisfies ToolHandler,
} satisfies Tool<FreeHandId>;

type FreeHandId = "FREE_HAND";

export {FREE_HAND, type FreeHandId};
