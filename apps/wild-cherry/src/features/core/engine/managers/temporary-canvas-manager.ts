import {CoreFrame, CoreNode, CoreProperties} from "@core/store/store";
import {drawFrame, drawNode} from "../draw";
import {setCtxProperties} from "../utils";
import {TEMP_CANVAS_ID} from "@core/const";
import {getCtx} from "@core/store/utils";

class TemporaryCanvasManager {
  private mainCtx: CanvasRenderingContext2D;
  private tempCtx: CanvasRenderingContext2D;
  private isInitialized: boolean = false;

  constructor(ctx: CanvasRenderingContext2D) {
    this.tempCtx = getCtx(
      document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement
    );
    this.mainCtx = ctx;
  }

  /**
   *
   * Call this method before drawing on the temporary canvas
   *
   */
  public initialize(properties: Partial<CoreProperties>): void {
    if (this.isInitialized) {
      throw new Error("TemporaryCanvasManager: already initialized");
    }

    if (!this.tempCtx) {
      throw new Error("TemporaryCanvasManager: tempCtx not available");
    }

    this.tempCtx.save();
    this.resize(this.mainCtx.canvas.width, this.mainCtx.canvas.height);
    this.tempCtx.canvas.style.display = "block";
    setCtxProperties(this.tempCtx, properties);

    this.isInitialized = true;
  }

  public clear(): void {
    if (!this.tempCtx) return;
    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );
  }

  public renderNode(node: CoreNode): void {
    if (!this.tempCtx) return;
    if (!this.isInitialized) {
      throw new Error("TemporaryCanvasManager: not initialized");
    }

    drawNode(this.tempCtx, node, false);
  }

  public renderFrame(frame: CoreFrame): void {
    if (!this.tempCtx) return;
    if (!this.isInitialized) {
      throw new Error("TemporaryCanvasManager: not initialized");
    }

    drawFrame(this.tempCtx, frame, false);
  }

  public resize(width: number, height: number): void {
    if (!this.tempCtx) return;
    this.tempCtx.canvas.width = width;
    this.tempCtx.canvas.height = height;
  }

  public destroy(): void {
    if (!this.tempCtx) return;

    this.tempCtx.canvas.style.display = "none";
    this.clear();
    this.tempCtx.restore();
    this.isInitialized = false;
  }

  public getContext(): CanvasRenderingContext2D {
    return this.tempCtx;
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }
}

export {TemporaryCanvasManager};
