import { createStore } from "zustand/vanilla";
import { ToolId, TOOLS } from "../lib/tools";
import {
  copyCanvas,
  getCtx,
  restoreCanvasState,
  saveCanvasState,
} from "../lib/utils";
import { ShapeOption } from "../lib/types";

// _ stands for extended properties
declare global {
  interface CanvasRenderingContext2D {
    _ext_shapeOption: ShapeOption;
  }
}

type CanvasContextProps = Pick<
  CanvasRenderingContext2D,
  | "fillStyle"
  | "strokeStyle"
  | "lineWidth"
  | "lineCap"
  | "lineJoin"
  | "miterLimit"
  | "lineDashOffset"
  | "shadowBlur"
  | "shadowColor"
  | "shadowOffsetX"
  | "shadowOffsetY"
  | "globalAlpha"
  | "globalCompositeOperation"
  | "font"
  | "textAlign"
  | "textBaseline"
  | "direction"
  | "imageSmoothingEnabled"
  | "imageSmoothingQuality"
  | "_ext_shapeOption"
>;

type CherryState = {
  ctx: CanvasRenderingContext2D | null;
  currentHistoryIdx: number;
  history: ImageData[];
  toolId: ToolId;
  height: number;
  width: number;
  properties: CanvasContextProps;
};

type CherryActions = {
  setToolId: (tool_id: ToolId) => void;
  setCanvasInitProperties: (canvas: HTMLCanvasElement) => void;
  resetState: () => void;
  setProperty: <T extends keyof CanvasContextProps>(
    property: T,
    value: CanvasRenderingContext2D[T]
  ) => void;
  setSize: (height: number, width: number) => void;
  setHistory: () => void;
  restoreFromHistory: (inc: 1 | -1) => void;
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  ctx: null,
  history: [],
  currentHistoryIdx: 0,
  toolId: TOOLS.FREE_HAND.id,
  height: 800,
  width: 800,
  properties: {
    // ctx
    fillStyle: "#FFFFFF",
    strokeStyle: "#000000",
    lineWidth: 2,
    lineCap: "round",
    lineJoin: "miter",
    miterLimit: 10,
    lineDashOffset: 0,
    shadowBlur: 0,
    shadowColor: "#000000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    // ctx extended
    _ext_shapeOption: "stroke_and_transparent",
  },
};

const SETTINGS = {
  MAX_HISTORY_LENGTH: 9,
} as const;

const createCherryStore = (initState: CherryState = DEFAULT_STATE) => {
  return createStore<CherryStore>()((set, get) => ({
    ...initState,
    setCanvasInitProperties: canvas => {
      const { width, height, setHistory, properties } = get();

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas, { willReadFrequently: true });

      Object.entries(properties).forEach(([key, value]) => {
        ctx[key as keyof CanvasContextProps] = value as never;
      });

      ctx.fillRect(0, 0, width, height);
      set({ ctx });
      setHistory();
    },
    resetState: () => {
      const { ctx, setHistory } = get();

      if (!ctx) return;

      ctx.canvas.width = DEFAULT_STATE.width;
      ctx.canvas.height = DEFAULT_STATE.height;

      Object.entries(DEFAULT_STATE.properties).forEach(([key, value]) => {
        ctx[key as keyof CanvasContextProps] = value as never;
      });

      ctx.fillRect(0, 0, DEFAULT_STATE.width, DEFAULT_STATE.height);
      set({ ...DEFAULT_STATE, ctx: ctx });
      setHistory();
    },

    setToolId: toolId => {
      const { setProperty } = get();

      switch (toolId) {
        case TOOLS.FREE_HAND.id:
          setProperty("lineWidth", DEFAULT_STATE.properties.lineWidth);
          setProperty("lineCap", DEFAULT_STATE.properties.lineCap);
          setProperty("lineJoin", "round");
          break;
      }

      set({ toolId });
    },

    setProperty: (property, value) => {
      const { ctx, properties } = get();
      if (!ctx) return;

      ctx[property] = value;
      set({ properties: { ...properties, [property]: value } });
    },
    setSize: (height, width) => {
      const { ctx, setHistory } = get();
      if (!ctx) return;

      const savedState = saveCanvasState(ctx);
      const temp = copyCanvas(ctx);

      ctx.canvas.width = width;
      ctx.canvas.height = height;

      restoreCanvasState(ctx, savedState);
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(temp, 0, 0);

      setHistory();
      set({ height, width });
    },
    setHistory: () => {
      const { ctx, history } = get();
      if (!ctx) return;

      const imageData = ctx.getImageData(
        0,
        0,
        ctx.canvas.width,
        ctx.canvas.height
      );

      const newHistory =
        history.length === SETTINGS.MAX_HISTORY_LENGTH
          ? history.slice(0, -1)
          : history;

      set({ currentHistoryIdx: 0 });
      set({ history: [imageData, ...newHistory] });
    },
    restoreFromHistory: inc => {
      const { ctx, currentHistoryIdx, history } = get();
      if (!ctx) return;

      const newIdx = currentHistoryIdx + inc;

      const restoredImageData = history[newIdx];
      if (!restoredImageData) return;

      set({ currentHistoryIdx: newIdx });
      ctx.putImageData(restoredImageData, 0, 0);
    },
  }));
};

export { type CherryState, type CherryStore, createCherryStore, SETTINGS };
