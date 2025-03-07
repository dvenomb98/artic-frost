"use client";

import {MouseEvent, useRef} from "react";

import {TOOLS} from "@core/lib/tools";

import {useCherryStore} from "@core/providers/store-provider";

import {CANVAS_ID, TEMP_CANVAS_ID} from "./lib/config";
import {useCanvasRef} from "./lib/use-canvas-ref";

function Canvas() {
  const {initCanvas} = useCanvasRef();
  const isDrawing = useRef<boolean>(false);

  const {ctx, toolId, setHistory} = useCherryStore(state => state);

  function handleMouseDown(e: MouseEvent) {
    if (!ctx) return;
    isDrawing.current = true;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseDown(ctx, point);
  }

  function handleMouseUp(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseUp(ctx, point);

    isDrawing.current = false;
    setHistory();
  }

  function handleMouseMove(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseMove(ctx, point);
  }

  function handleMouseLeave(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseLeave(ctx, point);

    isDrawing.current = false;
    setHistory();
  }

  return (
    <div className="relative">
      <canvas
        id={TEMP_CANVAS_ID}
        className="pointer-events-none z-50"
        style={{
          position: "absolute",
          display: "none",
        }}
      />
      <canvas
        id={CANVAS_ID}
        ref={initCanvas}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />
    </div>
  );
}

export {Canvas};

function getCanvasCoords(ctx: CanvasRenderingContext2D, e: MouseEvent) {
  const rect = ctx.canvas.getBoundingClientRect();
  return {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  };
}
