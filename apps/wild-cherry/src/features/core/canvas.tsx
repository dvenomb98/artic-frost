"use client";

import * as React from "react";

import {useCoreStore, useCoreStoreInstance} from "./store/provider";
import {MAIN_CANVAS_ID, TEMP_CANVAS_ID} from "./const";
import {TCanvasMouseEvent} from "./lib/types";
import {DrawingEngine} from "./engine/engine";

function Canvas() {
  const storeApi = useCoreStoreInstance();
  const {ctx, initialize} = useCoreStore(state => state);
  const isDrawing = React.useRef<boolean>(false);
  const drawingEngine = React.useRef<DrawingEngine>(null);

  if (!drawingEngine.current && ctx) {
    drawingEngine.current = new DrawingEngine(ctx, storeApi);
  }

  const initializeCanvas = React.useCallback(
    (node: HTMLCanvasElement | null) => {
      if (!node) return;
      initialize(node);
    },
    [initialize]
  );

  function onMouseDown(e: TCanvasMouseEvent) {
    if (!drawingEngine.current) return;
    isDrawing.current = true;

    drawingEngine.current.onMouseDown(e);
  }

  function onMouseMove(e: TCanvasMouseEvent) {
    if (!drawingEngine.current) return;
    if (!isDrawing.current) {
      return;
    }

    drawingEngine.current.onMouseMove(e);
  }

  function onMouseUp(e: TCanvasMouseEvent) {
    if (!drawingEngine.current) return;
    if (!isDrawing.current) {
      return;
    }

    drawingEngine.current.onMouseUp(e);
    isDrawing.current = false;
  }

  function onMouseLeave(e: TCanvasMouseEvent) {
    if (!drawingEngine.current) return;
    if (!isDrawing.current) {
      return;
    }

    drawingEngine.current.onMouseLeave(e);
    isDrawing.current = false;
  }

  return (
    <section className="relative">
      <canvas
        id={TEMP_CANVAS_ID}
        className="pointer-events-none absolute hidden">
        Temporary Canvas
      </canvas>
      <canvas
        id={MAIN_CANVAS_ID}
        ref={initializeCanvas}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}>
        Drawing Canvas
      </canvas>
    </section>
  );
}

export {Canvas};
