"use client";

import { MouseEvent,  useRef } from "react";

import { TOOLS } from "@core/lib/tools";
import { getCtx } from "@core/lib/utils";

import { useCherryStore } from "@core/providers/store-provider";

import { CANVAS_ID } from "./lib/config";
import { useCanvasRef } from "./lib/use-canvas-ref";

function Canvas() {
  const { initCanvas } = useCanvasRef();
  const isDrawing = useRef<boolean>(false);

  const { canvas, tool_id } = useCherryStore(state => state);
  
  function handleMouseDown(e: MouseEvent) {
    if (!canvas) return;
    isDrawing.current = true;

    const point = getCanvasCoords(canvas, e);
    const tool = TOOLS[tool_id];
    const ctx = getCtx(canvas);

    if (!ctx) return;

    tool.handler.onMouseDown(ctx, point);
  }

  function handleMouseUp(e: MouseEvent) {
    if (!canvas) return;
    if (!isDrawing.current) return;

    isDrawing.current = false;
  }

  function handleMouseMove(e: MouseEvent) {
    if (!canvas) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(canvas, e);
    const tool = TOOLS[tool_id];
    const ctx = getCtx(canvas);

    if (!ctx) return;

    tool.handler.onMouseMove(ctx, point);
  }

  function handleMouseLeave(e: MouseEvent) {
    if (!canvas) return;
    if (!isDrawing.current) return;

    isDrawing.current = false;
  }

  return (
    <canvas
      id={CANVAS_ID}
      ref={initCanvas}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    />
  );
}

export { Canvas };

function getCanvasCoords(canvas: HTMLCanvasElement, e: MouseEvent) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
