// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

import { ToolId, TOOLS } from "../lib/tools";
import { copyCanvas, getCtx } from "../lib/utils";

type CherryState = {
  canvas: HTMLCanvasElement | null;
  tool_id: ToolId;
  line_width: number;
  line_color: string;
  background_color: string;
  height: number;
  width: number;
};

type CherryActions = {
  setToolId: (tool_id: ToolId) => void;
  setCanvas: (canvas: HTMLCanvasElement) => void;
  setCanvasInitProperties: () => void;

  setLineWidth: (line_width: number) => void;
  setLineColor: (line_color: string) => void;
  setSize: (height: number, width: number) => void;
  setBackground: (bg_color: string) => void;
  getState: () => CherryState;
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  canvas: null,
  tool_id: TOOLS.FREE_HAND.id,
  line_width: 2,
  line_color: "#00000",
  background_color: "#FFFFFF",
  height: 800,
  width: 800,
};

const createCherryStore = (initState: CherryState = DEFAULT_STATE) => {
  return createStore<CherryStore>()((set, get) => ({
    // State
    ...initState,
    // Helpers
    getState: () => {
      const {
        line_width,
        line_color,
        background_color,
        tool_id,
        height,
        width,
        canvas,
      } = get();

      return {
        line_width,
        line_color,
        background_color,
        tool_id,
        height,
        width,
        canvas,
      };
    },
    setCanvasInitProperties: () => {
      const { canvas, width, height, background_color } = get();

      if (!canvas) return;

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas);
      ctx.fillStyle = background_color;
      ctx.fillRect(0, 0, width, height);
    },
    // Actions
    setCanvas: (canvas) => set({ canvas }),
    setToolId: (tool_id) => {
      switch (tool_id) {
        case TOOLS.FREE_HAND.id:
          set({ tool_id, line_width: 2 });
          break;

        default:
          set({ tool_id });
          break;
      }
    },
    setLineWidth: (line_width) => set({ line_width }),
    setLineColor: (line_color) => set({ line_color }),
    setSize: (height, width) => {
      const { canvas, background_color } = get();

      if (!canvas) return;

      const temp = copyCanvas(canvas);

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas);

      ctx.fillStyle = background_color;
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(temp, 0, 0);

      set({ height, width });
    },
    setBackground: (bg_color: string) => {
      const { canvas } = get();

      if (!canvas) return;

      const ctx = getCtx(canvas);

      ctx.fillStyle = bg_color;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      set({ background_color: bg_color });
    },
  }));
};

export { type CherryState, type CherryStore, createCherryStore };
