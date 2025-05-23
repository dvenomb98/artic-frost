import {Shape} from "@core/store/store";
import {TempShape} from "@core/store/store";
import {draw} from "../draw";
import {ToolId} from "../tools";
import {TempCanvas, ShapeManager} from "./managers";
import {ToolHandler} from "./types";

function toolHandler(type: ToolId) {
  return {
    /*
     *
     * MOUSE DOWN
     *
     */
    onMouseDown: (ctx, point) => {
      TempCanvas.create(ctx, point);
      ShapeManager.create({
        points: [[point.x, point.y]],
        type,
      });

      draw(TempCanvas.get().tempCtx, ShapeManager.get());
    },
    /*
     *
     * MOUSE MOVE
     *
     */
    onMouseMove: (_, point) => {
      const {tempCtx} = TempCanvas.get();
      tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);

      switch (type) {
        case "FREE_HAND":
          ShapeManager.addPoint([point.x, point.y]);
          draw(tempCtx, ShapeManager.get());
          break;
        default:
          const shape = ShapeManager.get();
          draw(tempCtx, {
            ...shape,
            points: [...shape.points, [point.x, point.y]],
          });
      }
    },
    /*
     *
     * MOUSE UP
     *
     */
    onMouseUp: (ctx, point, manageShape) => {
      const {x, y} = point;
      ShapeManager.addPoint([x, y]);

      draw(ctx, ShapeManager.get());
      manageShape(ShapeManager.get());

      TempCanvas.clear();
      ShapeManager.clear();
    },
    /*
     *
     * MOUSE LEAVE
     *
     */
    onMouseLeave: (ctx, point, manageShape) => {
      switch (type) {
        case "FREE_HAND":
          ShapeManager.addPoint([point.x, point.y]);
          draw(ctx, ShapeManager.get());
          manageShape(ShapeManager.get());
          break;
        default:
          break;
      }

      TempCanvas.clear();
      ShapeManager.clear();
    },
  } satisfies ToolHandler;
}

export {toolHandler};
