"use client";

import {useRef} from "react";

function Playground() {
  const ref = useRef<HTMLCanvasElement>(null);

  function initRef(node: HTMLCanvasElement) {
    if (ref.current) {
      return;
    }

    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";

    ctx.fillRect(0, 0, node.width, node.height);
    ctx.beginPath();
    ctx.arcTo(10, 10, 20, 20, 2 * Math.PI);
    ctx.stroke();

    ref.current = node;
  }

  return <canvas id="canvas" ref={initRef} />;
}

export default Playground;
