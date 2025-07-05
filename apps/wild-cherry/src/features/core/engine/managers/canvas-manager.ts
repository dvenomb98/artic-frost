import {getCanvasTheme} from "../theme";
import {CameraManager} from "./camera-manager";
import {HitType} from "../collisions/collisions";
import {DrawManager} from "./draw-manager";

class CanvasManager {
  private ctx: CanvasRenderingContext2D;
  private cameraManager: CameraManager;
  private drawManager: DrawManager;

  constructor(
    ctx: CanvasRenderingContext2D,
    cameraManager: CameraManager,
    drawManager: DrawManager
  ) {
    if (!ctx) {
      throw new Error("CanvasManager: ctx is not initialized");
    }

    const theme = getCanvasTheme();

    this.cameraManager = cameraManager;
    this.drawManager = drawManager;

    this.ctx = ctx;

    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.ctx.fillStyle = theme.fillStyle;
    this.ctx.strokeStyle = theme.strokeStyle;

    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public render() {
    this.refill();
    this.ctx.save();
    this.cameraManager.applyCamera(this.ctx);
    this.drawManager.drawStore(this.ctx);
    this.ctx.restore();
  }

  public setCursorBasedOnCollision(hit: HitType | null) {
    const canvas = this.ctx.canvas;

    if (!hit) {
      canvas.style.cursor = "default";
      return;
    }

    switch (hit.type) {
      case "inside":
        canvas.style.cursor = "move";
        break;
      case "edge":
        switch (hit.edge) {
          case "top":
          case "bottom":
            canvas.style.cursor = "ns-resize";
            break;
          case "left":
          case "right":
            canvas.style.cursor = "ew-resize";
            break;
        }
        break;
      case "control-point":
        canvas.style.cursor = "grabbing";
        break;
      default:
        canvas.style.cursor = "default";
    }
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

  public destroy() {
    this.ctx.canvas.style.cursor = "default";
  }
}

export {CanvasManager};
