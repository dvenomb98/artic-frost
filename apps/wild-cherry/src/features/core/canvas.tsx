"use client";

import * as React from "react";

import {useCoreStore} from "./store/provider";
import {MAIN_CANVAS_ID, TEMP_CANVAS_ID} from "./const";
import {
  TCanvasKeyDownEvent,
  TCanvasMouseEvent,
  TCanvasWheelEvent,
} from "./lib/types";
import {useEngine} from "./engine/provider";

function Canvas() {
  const {initialize} = useCoreStore(state => ({
    initialize: state.initialize,
  }));

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

  function onWheel(e: TCanvasWheelEvent) {
    engine.getEngine().onWheel(e);
  }

  function onKeyDown(e: TCanvasKeyDownEvent) {
    engine.getEngine().onKeyDown(e);
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
        onWheel={onWheel}
        onMouseLeave={onMouseLeave}
        onKeyDown={onKeyDown}
        tabIndex={0}>
        Drawing Canvas
      </canvas>
    </section>
  );
}

export {Canvas};
