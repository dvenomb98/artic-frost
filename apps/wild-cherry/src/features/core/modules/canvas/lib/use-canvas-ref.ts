import { useCherryStore } from "@/features/core/providers/store-provider";
import { useCallback } from "react";

function useCanvasRef() {
  const { ctx, setCanvasInitProperties } = useCherryStore(state => state);

  const initCanvas = useCallback(
    (node: HTMLCanvasElement) => {
      if (node === null || ctx) return;
      setCanvasInitProperties(node);
    },
    [ctx, setCanvasInitProperties]
  );

  return { initCanvas };
}

export { useCanvasRef };
