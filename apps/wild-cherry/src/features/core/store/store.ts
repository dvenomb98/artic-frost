import {createStore} from "zustand/vanilla";
import {ToolId, TOOLS} from "../lib/tools";
import {
  changeSizeWithPreserve,
  getCanvasState,
  getCtx,
  restoreCanvasState,
} from "../lib/utils";
import {ShapeOption} from "../lib/types";

// _ stands for extended properties
declare global {
  interface CanvasRenderingContext2D {
    _ext_shapeOption: ShapeOption;
  }
}

type CanvasContextProps = {
  transform: DOMMatrix;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  miterLimit: number;
  lineDashOffset: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  direction: CanvasDirection;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  lineDash: number[];
  contextAttributes: CanvasRenderingContext2DSettings;
  _ext_shapeOption: ShapeOption;
};

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
  resetState: () => void;
  loadImage: (data: HTMLImageElement) => void;
  setCanvasInitProperties: (canvas: HTMLCanvasElement) => void;
  setProperty: <T extends keyof CanvasContextProps>(
    property: T,
    value: CanvasContextProps[T]
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
    transform:
      typeof window === "undefined"
        ? ({} as DOMMatrix)
        : new window.DOMMatrix(),
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
    lineDash: [],
    contextAttributes: {willReadFrequently: true},
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
      const {width, height, setHistory, properties} = get();

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas, {
        willReadFrequently: true,
      });

      const state = getCanvasState(ctx);
      restoreCanvasState(ctx, {...state, ...properties});
      ctx.fillRect(0, 0, width, height);
      set({ctx});
      setHistory();
    },
    loadImage: (data: HTMLImageElement) => {
      const {ctx, setSize} = get();
      if (!ctx) return;
      setSize(data.height, data.width);
      ctx.drawImage(data, 0, 0);
    },
    resetState: () => {
      const {ctx, setHistory} = get();

      if (!ctx) return;

      ctx.canvas.width = DEFAULT_STATE.width;
      ctx.canvas.height = DEFAULT_STATE.height;

      const state = getCanvasState(ctx);
      restoreCanvasState(ctx, {...state, ...DEFAULT_STATE.properties});

      ctx.fillRect(0, 0, DEFAULT_STATE.width, DEFAULT_STATE.height);
      set({...DEFAULT_STATE, ctx: ctx});
      setHistory();
    },

    setToolId: toolId => {
      const {setProperty} = get();

      switch (toolId) {
        case TOOLS.FREE_HAND.id:
          setProperty("lineWidth", DEFAULT_STATE.properties.lineWidth);
          setProperty("lineCap", DEFAULT_STATE.properties.lineCap);
          setProperty("lineJoin", "round");
          break;
      }

      set({toolId});
    },

    setProperty: <T extends keyof CanvasContextProps>(
      property: T,
      value: CanvasContextProps[T]
    ) => {
      const {ctx, properties} = get();
      if (!ctx) return;

      switch (property) {
        case "lineDash":
          ctx.setLineDash(value as number[]);
          break;
        case "transform":
          ctx.setTransform(value as DOMMatrix);
          break;
        case "contextAttributes":
          //  can't be changed after context creation
          console.error(
            "contextAttributes can't be changed after context creation"
          );
          break;
        default:
          (ctx[property as keyof CanvasRenderingContext2D] as any) = value;
      }

      set({
        properties: {
          ...properties,
          [property]: value,
        },
      });
    },
    setSize: (height, width) => {
      const {ctx, setHistory} = get();
      if (!ctx) return;

      changeSizeWithPreserve(ctx, height, width);
      setHistory();
      set({height, width});
    },
    setHistory: () => {
      const {ctx, history} = get();
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

      set({currentHistoryIdx: 0});
      set({
        history: [imageData, ...newHistory],
      });
    },
    restoreFromHistory: inc => {
      const {ctx, currentHistoryIdx, history} = get();
      if (!ctx) return;

      const newIdx = currentHistoryIdx + inc;

      const restoredImageData = history[newIdx];
      if (!restoredImageData) return;

      set({currentHistoryIdx: newIdx});
      ctx.putImageData(restoredImageData, 0, 0);
    },
  }));
};

export {
  type CherryState,
  type CherryStore,
  type CanvasContextProps,
  createCherryStore,
  SETTINGS,
};
