"use client";

import * as React from "react";

import {useCoreStore} from "./store/provider";
import {MAIN_CANVAS_ID, TEMP_CANVAS_ID} from "./const";
import {TCanvasMouseEvent} from "./lib/types";
import {useEngine} from "./engine/provider";

function Canvas() {
  const {initialize} = useCoreStore(state => state);
  const engine = useEngine();

  const initializeCanvas = React.useCallback(
    (node: HTMLCanvasElement | null) => {
      if (!node) return;
      initialize(node);
    },
    [initialize]
  );

  function onMouseDown(e: TCanvasMouseEvent) {
    engine.getEngine().onMouseDown(e);
  }

  function onMouseMove(e: TCanvasMouseEvent) {
    engine.getEngine().onMouseMove(e);
  }

  function onMouseUp(e: TCanvasMouseEvent) {
    engine.getEngine().onMouseUp(e);
  }

  function onMouseLeave(e: TCanvasMouseEvent) {
    engine.getEngine().onMouseLeave(e);
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
