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
  private shape: TempShape | null = null;

  public get() {
    if (!this.shape)
      throw new Error("You probably forgot to call createShape first");
    return this.shape;
  }

  public create(shape: TempShape) {
    this.shape = shape;
  }

  public clear() {
    this.shape = null;
  }

  public addPoint(point: number[]) {
    if (!this.shape) {
      throw new Error("You probably forgot to call createShape first");
    }
    this.shape.points.push(point);
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
  private startPoint: Point = {x: 0, y: 0};
  private tempCtx: CanvasRenderingContext2D | null = null;

  public create(ctx: CanvasRenderingContext2D, point: Point) {
    this.startPoint = {...point};

    const isInitialized = !!this.tempCtx;

    const tempCtx = this.tempCtx
      ? this.tempCtx
      : getCtx(document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement);

    if (!isInitialized) this.tempCtx = tempCtx;

    const copyState = getCanvasState(ctx);

    tempCtx.canvas.width = ctx.canvas.width;
    tempCtx.canvas.height = ctx.canvas.height;
    tempCtx.canvas.style.display = "block";

    restoreCanvasState(tempCtx, copyState);
  }

  public get() {
    if (!this.tempCtx) {
      throw new Error("You probably forgot to call create first!");
    }

    return {
      startPoint: this.startPoint,
      tempCtx: this.tempCtx,
    };
  }

  public clear(): void {
    this.startPoint = {x: 0, y: 0};

    if (!this.tempCtx) {
      throw new Error("You probably forgot to call create first!");
    }

    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );
    this.tempCtx.canvas.style.display = "none";
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
  private selectedShape: Shape | null = null;

  public get() {
    return this.selectedShape;
  }

  public create(shape: Shape) {
    this.selectedShape = shape;
  }

  public clear() {
    this.selectedShape = null;
  }

  public addPoint(point: number[]) {
    if (!this.selectedShape) {
      throw new Error("You probably forgot to call create first!");
    }

    this.selectedShape.points.push(point);
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
