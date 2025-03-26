import {z} from "zod";
import {CanvasContextProps, CherryStore} from "./store";
import {ToolId, TOOLS} from "../lib/tools";
import {blobToDataUrl, canvasImgFromBlob, dataUrlToBlob} from "../lib/utils";

const CHERRY_STORAGE_SCHEMA = z.object({
  dataUrl: z.string(),
  currentHistoryIdx: z.number(),
  history: z.array(z.string()),
  toolId: z.enum(Object.values(TOOLS).map(v => v.id) as [ToolId, ...ToolId[]]),
  height: z.number(),
  width: z.number(),
  properties: z.custom<CanvasContextProps>(),
});

async function preparePersistData(store: CherryStore) {
  const result: Partial<z.infer<typeof CHERRY_STORAGE_SCHEMA>> = {};

  if (!store.ctx) {
    throw new Error("Canvas context is not initialized");
  }

  result.dataUrl = store.ctx.canvas.toDataURL();
  result.currentHistoryIdx = store.currentHistoryIdx;
  result.toolId = store.toolId;
  result.height = store.height;
  result.width = store.width;
  result.properties = store.properties;
  result.history = await Promise.all(
    store.history.map(async blob => await blobToDataUrl(blob))
  );

  return result as z.infer<typeof CHERRY_STORAGE_SCHEMA>;
}

async function parsePersistData(data: z.infer<typeof CHERRY_STORAGE_SCHEMA>) {
  const [history, canvasDataUrl] = await Promise.all([
    Promise.all(
      data.history.map(async dataUrl => await dataUrlToBlob(dataUrl))
    ),
    dataUrlToBlob(data.dataUrl),
  ]);

  const img = await canvasImgFromBlob(canvasDataUrl);

  return {
    ...data,
    history,
    imgToLoad: img,
  };
}

type ParsedPersistData = Awaited<ReturnType<typeof parsePersistData>>;

export {
  preparePersistData,
  parsePersistData,
  CHERRY_STORAGE_SCHEMA,
  type ParsedPersistData,
};
