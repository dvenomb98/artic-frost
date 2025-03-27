import {MousePointerClick} from "lucide-react";
import {Tool, ToolHandler} from "./types";

const SELECTION = {
  id: "SELECTION",
  icon: MousePointerClick,
  handler: {
    onMouseDown: (ctx, point) => {},
    onMouseMove: (ctx, point) => {},
    onMouseUp: (ctx, point) => {},
    onMouseLeave: (ctx, point) => {},
  } satisfies ToolHandler,
} satisfies Tool<SelectionId>;

type SelectionId = "SELECTION";

export {SELECTION, type SelectionId};
