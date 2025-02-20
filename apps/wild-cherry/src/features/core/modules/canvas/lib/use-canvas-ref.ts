import { useCherryStore } from "@/features/core/providers/store-provider";
import { useCallback } from "react";

function useCanvasRef() {
  const { setCanvas, setBackground, canvas } = useCherryStore((state) => state);

  const initCanvas = useCallback(
    (node: HTMLCanvasElement) => {
      if (node === null || canvas) return;
      setCanvas(node);
      setBackground();
    },
    [canvas, setCanvas, setBackground],
  );

  return { initCanvas };
}

export { useCanvasRef };
