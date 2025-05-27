import {CoreFrame, CoreNode} from "@core/store/store";
import {drawAll, drawNode} from "../draw";
import {getCanvasTheme} from "../theme";
import {CameraManager} from "./camera-manager";

class CanvasManager {
  private ctx: CanvasRenderingContext2D;
  private cameraManager: CameraManager;

  constructor(ctx: CanvasRenderingContext2D, cameraManager: CameraManager) {
    if (!ctx) {
      throw new Error("CanvasManager: ctx is not initialized");
    }

    const theme = getCanvasTheme();

    this.cameraManager = cameraManager;

    this.ctx = ctx;

    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.ctx.fillStyle = theme.fillStyle;
    this.ctx.strokeStyle = theme.strokeStyle;

    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public render(
    nodes: CoreNode[],
    frame: CoreFrame | null,
    grid: boolean
  ): void {
    this.refill();
    this.ctx.save();
    this.cameraManager.applyCamera(this.ctx);
    drawAll(this.ctx, nodes, frame, grid, this.cameraManager);
    this.ctx.restore();
  }

  public renderNode(node: CoreNode): void {
    drawNode(this.ctx, node);
  }

  private refill(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public resize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.fillRect(0, 0, width, height);
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}

export {CanvasManager};
