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

function saveCanvasState  (ctx: CanvasRenderingContext2D)  {
  return {
    transform: ctx.getTransform(),

    strokeStyle: ctx.strokeStyle,
    fillStyle: ctx.fillStyle,
    globalAlpha: ctx.globalAlpha,
    lineWidth: ctx.lineWidth,
    lineCap: ctx.lineCap,
    lineJoin: ctx.lineJoin,
    miterLimit: ctx.miterLimit,
    lineDashOffset: ctx.lineDashOffset,
    shadowOffsetX: ctx.shadowOffsetX,
    shadowOffsetY: ctx.shadowOffsetY,
    shadowBlur: ctx.shadowBlur,
    shadowColor: ctx.shadowColor,
    globalCompositeOperation: ctx.globalCompositeOperation,
    font: ctx.font,
    textAlign: ctx.textAlign,
    textBaseline: ctx.textBaseline,
    direction: ctx.direction,
    imageSmoothingEnabled: ctx.imageSmoothingEnabled,

    lineDash: ctx.getLineDash(),

    contextAttributes: ctx.getContextAttributes(),
  };
};

function restoreCanvasState(
  ctx: CanvasRenderingContext2D,
  state: ReturnType<typeof saveCanvasState>
) {
  ctx.setTransform(state.transform);

  ctx.strokeStyle = state.strokeStyle;
  ctx.fillStyle = state.fillStyle;
  ctx.globalAlpha = state.globalAlpha;
  ctx.lineWidth = state.lineWidth;
  ctx.lineCap = state.lineCap;
  ctx.lineJoin = state.lineJoin;
  ctx.miterLimit = state.miterLimit;
  ctx.lineDashOffset = state.lineDashOffset;
  ctx.shadowOffsetX = state.shadowOffsetX;
  ctx.shadowOffsetY = state.shadowOffsetY;
  ctx.shadowBlur = state.shadowBlur;
  ctx.shadowColor = state.shadowColor;
  ctx.globalCompositeOperation = state.globalCompositeOperation;
  ctx.font = state.font;
  ctx.textAlign = state.textAlign;
  ctx.textBaseline = state.textBaseline;
  ctx.direction = state.direction;
  ctx.imageSmoothingEnabled = state.imageSmoothingEnabled;

  ctx.setLineDash(state.lineDash);
};

export { restoreCanvasState, saveCanvasState };

export { getCtx, copyCanvas };
