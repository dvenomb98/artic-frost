"use client";

import { useRef } from "react";

function Playground() {
  const ref = useRef<HTMLCanvasElement>(null);

  function initRef(node: HTMLCanvasElement) {
    if (ref.current) {
      return;
    }

    const ctx = node.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, node.width, node.height)
    ctx.strokeStyle = "#09f";
    ctx.beginPath();
    ctx.moveTo(10, 10);
    ctx.lineTo(140, 10);
    ctx.moveTo(10, 140);
    ctx.lineTo(140, 140);
    ctx.stroke();

    // Draw lines
    ctx.strokeStyle = "black";
    ["butt", "round", "square"].forEach((lineCap, i) => {
      ctx.lineWidth = 15;
      ctx.lineCap = lineCap as CanvasLineCap;
      ctx.beginPath();
      ctx.moveTo(25 + i * 50, 10);
      ctx.lineTo(25 + i * 50, 140);
      ctx.stroke();
    });

    ref.current = node;
  }

  return (
    <div className="min-h-screen w-full grid place-content-center">
      <canvas ref={initRef} width={800} height={800} />
    </div>
  );
}

export default Playground;
