function getCtx(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d")!;

  if (!ctx) throw new Error("Failed to get context");

  return ctx;
}

function copyCanvas(canvas: HTMLCanvasElement) {
  const copy = document.createElement("canvas");
  copy.width = canvas.width;
  copy.height = canvas.height;
  const ctx = getCtx(copy);
  ctx.drawImage(canvas, 0, 0);
  return copy;
}

export { getCtx, copyCanvas };
