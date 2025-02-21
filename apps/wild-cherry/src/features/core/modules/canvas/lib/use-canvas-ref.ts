import { useCherryStore } from "@/features/core/providers/store-provider";
import { useCallback } from "react";

function useCanvasRef() {
  const { canvas, setCanvasInitProperties } = useCherryStore((state) => state);

  const initCanvas = useCallback(
    (node: HTMLCanvasElement) => {
      if (node === null || canvas) return;
      setCanvasInitProperties(node);
    },
    [canvas, setCanvasInitProperties],
  );

  return { initCanvas };
}

export { useCanvasRef };
