import { useCherryStore } from "@/features/core/providers/store-provider";
import { useCallback } from "react";

function useCanvasRef() {
  const { setCanvas, setCanvasInitProperties, canvas } = useCherryStore((state) => state);

  const initCanvas = useCallback(
    (node: HTMLCanvasElement) => {
      if (node === null || canvas) return;
      setCanvas(node);
      setCanvasInitProperties();
    },
    [canvas, setCanvas, setCanvasInitProperties],
  );

  return { initCanvas };
}

export { useCanvasRef };
