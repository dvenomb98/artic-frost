import {Shape, TempShape} from "@core/store/store";
import {TEMP_CANVAS_ID} from "@core/modules/canvas/lib/config";
import {Point} from "../types";
import {getCanvasState, getCtx, restoreCanvasState} from "../utils";

/*
 *
 *
 * ShapeManager
 *
 *
 */

class ShapeManagerInstance {
  #shape: TempShape | null = null;

  get() {
    if (!this.#shape)
      throw new Error("You probably forgot to call createShape first");
    return this.#shape;
  }

  create(shape: TempShape) {
    this.#shape = shape;
  }

  clear() {
    this.#shape = null;
  }

  addPoint(point: number[]) {
    if (!this.#shape) {
      throw new Error("You probably forgot to call createShape first");
    }
    this.#shape.points.push(point);
  }
}

/*
 *
 *
 * TempCanvas
 *
 *
 */
class TempCanvasInstance {
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

/*
 *
 *
 * SelectionManager
 *
 *
 */

class SelectionManagerInstance {
  #selectedShape: Shape | null = null;

  get() {
    return this.#selectedShape;
  }

  create(shape: Shape) {
    this.#selectedShape = shape;
  }

  clear() {
    this.#selectedShape = null;
  }

  addPoint(point: number[]) {
    if (!this.#selectedShape) {
      throw new Error("You probably forgot to call create first!");
    }

    this.#selectedShape.points.push(point);
  }
}

/*
 *
 *
 *
 *
 *
 */
const TempCanvas = new TempCanvasInstance();
const ShapeManager = new ShapeManagerInstance();
const SelectionManager = new SelectionManagerInstance();

export {TempCanvas, ShapeManager, SelectionManager};
