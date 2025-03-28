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

async function preparePersistData(store: CherryStore) {}

async function parsePersistData(data: z.infer<typeof CHERRY_STORAGE_SCHEMA>) {}

type ParsedPersistData = Awaited<ReturnType<typeof parsePersistData>>;

export {
  preparePersistData,
  parsePersistData,
  CHERRY_STORAGE_SCHEMA,
  type ParsedPersistData,
};
