// src/stores/cherry-store.ts
import { createStore } from "zustand/vanilla";
import { ToolId, TOOLS } from "../lib/tools";
import {
  copyCanvas,
  getCtx,
  restoreCanvasState,
  saveCanvasState,
} from "../lib/utils";

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
>;

type CherryState = {
  canvas: HTMLCanvasElement | null;
  toolId: ToolId;
  height: number;
  width: number;
} & CanvasContextProps;

type CherryActions = {
  setToolId: (
    tool_id: ToolId,
  ) => void;
  setCanvasInitProperties: (canvas: HTMLCanvasElement) => void;
  setSize: (height: number, width: number) => void;
  setBackground: (bg_color: string) => void;
  setProperty: <T extends keyof CanvasContextProps>(
    property: T,
    value: CanvasRenderingContext2D[T]
  ) => void;
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  canvas: null,
  toolId: TOOLS.FREE_HAND.id,
  height: 500,
  width: 500,
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
};

const createCherryStore = (initState: CherryState = DEFAULT_STATE) => {
  return createStore<CherryStore>()((set, get) => ({
    ...initState,
    setCanvasInitProperties: canvas => {
      const { width, height, ...contextProps } = get();

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas);

      Object.entries(contextProps).forEach(([key, value]) => {
        if (key in ctx && key !== "canvas" && key !== "toolId") {
          ctx[key as keyof CanvasContextProps] = value as never;
        }
      });

      ctx.fillRect(0, 0, width, height);
      set({ canvas });
    },

    setToolId: (toolId) => {
      const { setProperty } = get();

      switch (toolId) {
        case TOOLS.FREE_HAND.id:
          setProperty("lineWidth", DEFAULT_STATE.lineWidth);
          setProperty("lineCap", DEFAULT_STATE.lineCap);
          setProperty("lineJoin", "round");
          break;
      }

      set({ toolId });
    },

    setProperty: (property, value) => {
      const { canvas } = get();
      if (!canvas) return;

      const ctx = getCtx(canvas);
      ctx[property] = value;
      set({ [property]: value });
    },
    setSize: (height, width) => {
      const { canvas } = get();
      if (!canvas) return;

      const ctx = getCtx(canvas);
      const savedState = saveCanvasState(ctx);
      const temp = copyCanvas(canvas);

      canvas.width = width;
      canvas.height = height;

      restoreCanvasState(ctx, savedState);
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(temp, 0, 0);

      set({ height, width });
    },
    setBackground: color => {
      const { canvas, setProperty } = get();
      if (!canvas) return;
      const ctx = getCtx(canvas);

      setProperty("fillStyle", color);
      console.log(ctx)
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    },
  }));
};

export { type CherryState, type CherryStore, createCherryStore };
