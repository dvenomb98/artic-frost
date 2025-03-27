import {TEMP_CANVAS_ID} from "../modules/canvas/lib/config";
import {Point} from "./types";
import {getCanvasState, getCtx, restoreCanvasState} from "./utils";

class TempCanvas {
  #startPoint: Point = {x: 0, y: 0};
  #tempCtx: CanvasRenderingContext2D | null = null;

  create(ctx: CanvasRenderingContext2D, point: Point) {
    this.#startPoint = {...point};

    const isInitialized = !!this.#tempCtx;

    const tempCtx = this.#tempCtx
      ? this.#tempCtx
      : getCtx(document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement);

    if (!isInitialized) this.#tempCtx = tempCtx;

    const copyState = getCanvasState(ctx);

    tempCtx.canvas.width = ctx.canvas.width;
    tempCtx.canvas.height = ctx.canvas.height;
    tempCtx.canvas.style.display = "block";

    restoreCanvasState(tempCtx, copyState);
  }

  get() {
    if (!this.#tempCtx) {
      throw new Error("You probably forgot to call create first!");
    }

    return {
      startPoint: this.#startPoint,
      tempCtx: this.#tempCtx,
    };
  }

  clear(): void {
    this.#startPoint = {x: 0, y: 0};

    if (!this.#tempCtx) {
      throw new Error("You probably forgot to call create first!");
    }

    this.#tempCtx.clearRect(
      0,
      0,
      this.#tempCtx.canvas.width,
      this.#tempCtx.canvas.height
    );
    this.#tempCtx.canvas.style.display = "none";
  }
}

const temp = new TempCanvas();

export {temp};
