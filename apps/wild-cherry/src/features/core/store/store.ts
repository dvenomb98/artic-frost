// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

import { ToolId, TOOLS } from "../lib/tools";
import {
  copyCanvas,
  getCtx,
  restoreCanvasState,
  saveCanvasState,
} from "../lib/utils";

type CherryState = {
  canvas: HTMLCanvasElement | null;
  tool_id: ToolId;
  line_width: number;
  stroke_style: string;
  fill_style: string;
  height: number;
  width: number;
};

type CherryActions = {
  setToolId: (tool_id: ToolId) => void;
  setCanvasInitProperties: (canvas: HTMLCanvasElement) => void;

  setLineWidth: (line_width: number) => void;
  setStrokeStyle: (stroke_style: string) => void;
  setFillStyle: (fill_style: string) => void;

  setSize: (height: number, width: number) => void;
  setBackground: (bg_color: string) => void;
  getState: () => CherryState;
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  canvas: null,
  tool_id: TOOLS.FREE_HAND.id,
  line_width: 2,
  stroke_style: "#00000",
  fill_style: "#FFFFFF",
  height: 500,
  width: 500,
};

const createCherryStore = (initState: CherryState = DEFAULT_STATE) => {
  return createStore<CherryStore>()((set, get) => ({
    // State
    ...initState,
    // Helpers
    getState: () => {
      const {
        canvas,
        line_width,
        stroke_style,
        fill_style,
        tool_id,
        height,
        width,
      } = get();

      return {
        canvas,
        line_width,
        stroke_style,
        fill_style,
        tool_id,
        height,
        width,
      };
    },
    setCanvasInitProperties: (canvas: HTMLCanvasElement) => {
      const { width, height, fill_style } = get();

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas);

      ctx.fillStyle = fill_style;
      ctx.fillRect(0, 0, width, height);
      set({ canvas });
    },

    setToolId: tool_id => {
      const { setLineWidth } = get();

      switch (tool_id) {
        case TOOLS.FREE_HAND.id:
          setLineWidth(DEFAULT_STATE.line_width);
          set({ tool_id });
          break;

        default:
          set({ tool_id });
          break;
      }
    },
    /*
     * Primitive Actions
     * Use for setting canvas properties
     */
    setLineWidth: line_width => {
      const { canvas } = get();
      if (!canvas) return;

      const ctx = getCtx(canvas);
      ctx.lineWidth = line_width;

      set({ line_width });
    },
    setStrokeStyle: stroke_style => {
      const { canvas } = get();
      if (!canvas) return;

      const ctx = getCtx(canvas);
      ctx.strokeStyle = stroke_style;

      set({ stroke_style });
    },
    setFillStyle: fill_style => {
      const { canvas } = get();
      if (!canvas) return;

      const ctx = getCtx(canvas);
      ctx.fillStyle = fill_style;
      set({ fill_style });
    },

    /*
     * Composed Actions
     * Use for more complex actions
     */
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
    setBackground: (color: string) => {
      const { canvas, setFillStyle } = get();

      if (!canvas) return;

      const ctx = getCtx(canvas);

      setFillStyle(color);
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    },
  }));
};

export { type CherryState, type CherryStore, createCherryStore };
