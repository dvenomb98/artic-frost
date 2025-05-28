import {CoreProperties} from "@core/store/store";
import {drawFrame, drawNode} from "../draw";
import {setCtxProperties} from "../utils";
import {TEMP_CANVAS_ID} from "@core/const";
import {getCtx} from "@core/store/utils";

import {CameraManager} from "./camera-manager";
import {NodeManager} from "./node-manager";
import {FrameManager} from "./frame-manager";

class TemporaryCanvasManager {
  private mainCtx: CanvasRenderingContext2D;
  private tempCtx: CanvasRenderingContext2D;
  private isInitialized: boolean = false;

  private cameraManager: CameraManager;
  private nodeManager: NodeManager;
  private frameManager: FrameManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    cameraManager: CameraManager,
    nodeManager: NodeManager,
    frameManager: FrameManager
  ) {
    this.tempCtx = getCtx(
      document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement
    );

    this.mainCtx = ctx;

    this.cameraManager = cameraManager;
    this.nodeManager = nodeManager;
    this.frameManager = frameManager;
  }

  /**
   *
   * Call this method before drawing on the temporary canvas
   *
   */
  public initialize(type: "node" | "frame"): void {
    if (this.isInitialized) {
      throw new Error("TemporaryCanvasManager: already initialized");
    }

    if (!this.tempCtx) {
      throw new Error("TemporaryCanvasManager: tempCtx not available");
    }

    this.tempCtx.save();
    this.resize(this.mainCtx.canvas.width, this.mainCtx.canvas.height);
    this.tempCtx.canvas.style.display = "block";
    this.cameraManager.applyCamera(this.tempCtx);

    const properties = this.getTargetProperties(type);
    setCtxProperties(this.tempCtx, properties);

    this.isInitialized = true;
  }

  public clear(): void {
    if (!this.tempCtx) return;
    this.tempCtx.save();
    this.cameraManager.resetZoom(this.tempCtx);
    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );
    this.tempCtx.restore();
  }

  public renderNode(): void {
    if (!this.tempCtx) return;
    if (!this.isInitialized) {
      throw new Error("TemporaryCanvasManager: not initialized");
    }

    const node = this.nodeManager.getCurrentNode();

    if (!node) {
      throw new Error("TemporaryCanvasManager: node not found");
    }

    drawNode(this.tempCtx, node, false);
  }

  public renderFrame(): void {
    if (!this.tempCtx) return;
    if (!this.isInitialized) {
      throw new Error("TemporaryCanvasManager: not initialized");
    }

    const frame = this.frameManager.getCurrentFrame();

    if (!frame) {
      throw new Error("TemporaryCanvasManager: frame not found");
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
    this.isInitialized = false;
    this.tempCtx.canvas.style.display = "none";
    this.clear();
    this.tempCtx.restore();
  }

  public getContext(): CanvasRenderingContext2D {
    return this.tempCtx;
  }

  public getIsInitialized(): boolean {
    return this.isInitialized;
  }

  private getTargetProperties(type: "node" | "frame"): Partial<CoreProperties> {
    switch (type) {
      case "node":
        const node = this.nodeManager.getCurrentNode();
        if (!node) throw new Error("Node is not defined in node manager");
        return node.properties;
      case "frame":
        const frame = this.frameManager.getCurrentFrame();
        if (!frame) throw new Error("Frame is not defined in frame manager");
        return frame.properties;
    }
  }
}

export {TemporaryCanvasManager};
