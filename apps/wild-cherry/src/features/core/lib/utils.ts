import { CanvasContextProps } from "../store/store";

function getCtx(
  canvas: HTMLCanvasElement,
  options?: CanvasRenderingContext2DSettings
) {
  const ctx = canvas.getContext("2d", options)!;

  if (!ctx) throw new Error("Failed to get context");

  return ctx;
}

function copyCanvas(ctx: CanvasRenderingContext2D) {
  const copy = document.createElement("canvas");
  copy.width = ctx.canvas.width;
  copy.height = ctx.canvas.height;
  getCtx(copy).drawImage(ctx.canvas, 0, 0);
  return copy;
}

function getCanvasState(ctx: CanvasRenderingContext2D) {
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

    _ext_shapeOption: ctx._ext_shapeOption,
  };
}

function restoreCanvasState(
  ctx: CanvasRenderingContext2D,
  state: ReturnType<typeof getCanvasState>,
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

  ctx._ext_shapeOption = state._ext_shapeOption;
}

function changeSizeWithPreserve(
  ctx: CanvasRenderingContext2D,
  height: number,
  width: number
) {
  const savedState = getCanvasState(ctx);
  const temp = copyCanvas(ctx);

  ctx.canvas.width = width;
  ctx.canvas.height = height;

  restoreCanvasState(ctx, savedState);
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(temp, 0, 0);
}

export {restoreCanvasState, getCanvasState, changeSizeWithPreserve};

export {getCtx, copyCanvas};
