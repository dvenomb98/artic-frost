import {CanvasContextProps} from "../store/store";

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

function getCanvasState(ctx: CanvasRenderingContext2D): CanvasContextProps {
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
    imageSmoothingQuality: ctx.imageSmoothingQuality,
    lineDash: ctx.getLineDash(),
    contextAttributes: ctx.getContextAttributes(),

    _ext_shapeOption: ctx._ext_shapeOption,
  };
}

function restoreCanvasState(
  ctx: CanvasRenderingContext2D,
  state: CanvasContextProps
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
  ctx.imageSmoothingQuality = state.imageSmoothingQuality;

  ctx.setLineDash(state.lineDash);

  ctx._ext_shapeOption = state._ext_shapeOption;
}

function canvasImgToBlob(ctx: CanvasRenderingContext2D): Promise<Blob> {
  return new Promise((resolve, reject) => {
    ctx.canvas.toBlob(blob => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Failed to create blob from canvas"));
      }
    });
  });
}

function canvasImgFromBlob(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(blob);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to load image"));
    };

    img.src = objectUrl;
    img.crossOrigin = "Anonymous";
  });
}

async function blobToDataUrl(blob: Blob) {
  const img = await canvasImgFromBlob(blob);
  const canvas = document.createElement("canvas");
  const ctx = getCtx(canvas);

  ctx.canvas.width = img.width;
  ctx.canvas.height = img.height;

  ctx.drawImage(img, 0, 0);
  return canvas.toDataURL();
}

async function dataUrlToBlob(dataUrl: string) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return blob;
}
export {
  restoreCanvasState,
  getCanvasState,
  canvasImgToBlob,
  canvasImgFromBlob,
  blobToDataUrl,
  dataUrlToBlob,
};
export {getCtx, copyCanvas};
