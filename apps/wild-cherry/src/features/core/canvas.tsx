"use client";

import * as React from "react";

import {useCoreStore} from "./store/provider";
import {MAIN_CANVAS_ID, TEMP_CANVAS_ID} from "./const";
import {TCanvasMouseEvent} from "./lib/types";
import {DrawingService} from "./draw/service";

function Canvas() {
  const store = useCoreStore(state => state);
  const {initialize, ctx} = store;
  const isDrawing = React.useRef<boolean>(false);

  const drawingService = React.useMemo(() => {
    if (!ctx) return null;

    return new DrawingService(store, {
      fillStyle: "red",
      strokeStyle: "blue",
      lineWidth: 2,
      lineCap: "round",
      shapeOption: "fill_and_stroke",
    });
  }, [store]);

  const initializeCanvas = React.useCallback(
    (node: HTMLCanvasElement | null) => {
      if (!node) return;
      initialize(node);
    },
    [initialize]
  );

  function onMouseDown(e: TCanvasMouseEvent) {
    if (!drawingService) return;
    isDrawing.current = true;

    drawingService.onMouseDown(e);
  }

  function onMouseMove(e: TCanvasMouseEvent) {
    if (!drawingService) return;
    if (!isDrawing.current) {
      return;
    }

    drawingService.onMouseMove(e);
  }

  function onMouseUp(e: TCanvasMouseEvent) {
    if (!drawingService) return;
    if (!isDrawing.current) {
      return;
    }

    drawingService.onMouseUp(e);
    isDrawing.current = false;
  }

  function onMouseLeave(e: TCanvasMouseEvent) {
    if (!drawingService) return;
    if (!isDrawing.current) {
      return;
    }

    drawingService.onMouseLeave(e);
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
