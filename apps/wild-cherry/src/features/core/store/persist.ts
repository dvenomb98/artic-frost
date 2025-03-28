import {z} from "zod";
import {CanvasContextProps, CherryStore, Shape} from "./store";
import {ToolId, TOOLS} from "../lib/tools";

const CHERRY_STORAGE_SCHEMA = z.object({
  currentHistoryIdx: z.number(),
  toolId: z.enum(Object.values(TOOLS).map(v => v.id) as [ToolId, ...ToolId[]]),
  height: z.number(),
  width: z.number(),
  properties: z.custom<CanvasContextProps>(),
  shapes: z.custom<Shape[]>(),
});

function preparePersistData(
  store: CherryStore
): z.infer<typeof CHERRY_STORAGE_SCHEMA> {
  const {currentHistoryIdx, toolId, height, width, properties, shapes} = store;

  return {
    currentHistoryIdx,
    toolId,
    height,
    width,
    properties,
    shapes,
  };
}

export {preparePersistData, CHERRY_STORAGE_SCHEMA};
