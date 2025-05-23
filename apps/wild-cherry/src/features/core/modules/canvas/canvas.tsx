"use client";

import {MouseEvent, useRef} from "react";

import {TOOLS} from "@core/lib/tools";
import {Shape, TempShape} from "@core/store/store";
import {useCherryStore} from "@core/providers/store-provider";

import {CANVAS_ID, TEMP_CANVAS_ID} from "./lib/config";
import {useCanvasRef} from "./lib/use-canvas-ref";

function Canvas() {
  const {initCanvas} = useCanvasRef();
  const isDrawing = useRef<boolean>(false);

  const {ctx, toolId, addShape, updateShape, shapes} = useCherryStore(
    state => state
  );

  function manageShape(shape: TempShape, oldShape?: Shape) {
    return oldShape ? updateShape(oldShape.id, shape.points) : addShape(shape);
  }

  function handleMouseDown(e: MouseEvent) {
    if (!ctx) return;
    isDrawing.current = true;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseDown(ctx, point, shapes);
  }

  function handleMouseMove(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseMove(ctx, point);
  }

  function handleMouseUp(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseUp(ctx, point, manageShape);

    isDrawing.current = false;
  }

  function handleMouseLeave(e: MouseEvent) {
    if (!ctx) return;
    if (!isDrawing.current) return;

    const point = getCanvasCoords(ctx, e);
    const tool = TOOLS[toolId];

    tool.handler.onMouseLeave(ctx, point, manageShape);

    isDrawing.current = false;
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
