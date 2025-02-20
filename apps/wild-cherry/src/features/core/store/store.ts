// src/stores/counter-store.ts
import { createStore } from "zustand/vanilla";

import { ToolId, TOOLS } from "../lib/tools";
import { COLORS } from "../lib/colors";
import { getCtx } from "../lib/utils";

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
  setLineWidth: (line_width: number) => void;
  setLineColor: (line_color: string) => void;
  setSize: (height: number, width: number) => void;
  setBackground: (bg_color?: string) => void;
  getState: () => CherryState;
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  canvas: null,
  tool_id: TOOLS.FREE_HAND.id,
  line_width: 2,
  line_color: COLORS.BLACK,
  background_color: COLORS.WHITE,
  height: 600,
  width: 600,
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

      const tempCanvas = document.createElement("canvas");
      const tempCtx = tempCanvas.getContext("2d");

      if (!tempCtx) return;

      tempCanvas.width = canvas.width;
      tempCanvas.height = canvas.height;
      tempCtx.drawImage(canvas, 0, 0);

      canvas.width = width;
      canvas.height = height;

      const ctx = getCtx(canvas);

      if (!ctx) return;

      ctx.fillStyle = background_color;
      ctx.fillRect(0, 0, width, height);

      ctx.drawImage(tempCanvas, 0, 0);

      set({ height, width });
    },
    setBackground: (bg_color?: string) => {
      const { canvas, background_color } = get();

      if (!canvas) return;

      const temp = document.createElement("canvas");

      temp.width = canvas.width;
      temp.height = canvas.height;

      const tempCtx = getCtx(temp);
      const ctx = getCtx(canvas);

      if (!tempCtx || !ctx) return;

      tempCtx.drawImage(canvas, 0, 0);

      ctx.fillStyle = bg_color || background_color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(temp, 0, 0);

      if (bg_color) {
        set({ background_color: bg_color });
      }
    },
  }));
};

export { type CherryState, type CherryStore, createCherryStore };
