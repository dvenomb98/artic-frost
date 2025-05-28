import {CoreStoreInstance} from "@core/store/store";
import {TCanvasMouseEvent, TCanvasWheelEvent} from "@core/lib/types";
import {Camera, Point} from "../types";
import {DEFAULT_CAMERA} from "../const";
import {debounce} from "@/lib/utils";

type CameraBounds = {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
};

class CameraManager {
  private storeInstance: CoreStoreInstance;
  private camera: Camera = {
    ...DEFAULT_CAMERA,
  };

  private zoomIntensity = 0.04;
  private minZoom = 0.1;
  private maxZoom = 10.0;
  private syncToStore: () => void;

  constructor(storeInstance: CoreStoreInstance) {
    this.storeInstance = storeInstance;

    this.syncToStore = debounce(() => {
      const state = this.storeInstance.getState();
      state.setCamera({...this.camera});
    }, 50);
  }

  public setZoomByWheelEvent(
    ctx: CanvasRenderingContext2D,
    e: TCanvasWheelEvent
  ): void {
    const zoomFactor = e.deltaY < 0 ? 1 : -1;
    const mouse = this.screenToWorld(ctx, e);
    this.setCamera(zoomFactor, {x: mouse.x, y: mouse.y});
  }

  public setCamera(factor: number, center?: Point): void {
    const zoomIntensity = this.getZoomIntensity(factor);
    const oldScale = this.camera.scale;
    const newScale = Math.max(
      this.minZoom,
      Math.min(oldScale * zoomIntensity, this.maxZoom)
    );

    if (newScale === oldScale) {
      return;
    }

    const zoomCenterX = center?.x ?? this.camera.x;
    const zoomCenterY = center?.y ?? this.camera.y;

    const actualFactor = newScale / oldScale;

    this.camera.x = zoomCenterX + (this.camera.x - zoomCenterX) / actualFactor;
    this.camera.y = zoomCenterY + (this.camera.y - zoomCenterY) / actualFactor;
    this.camera.scale = newScale;

    this.syncToStore();
  }

  public applyCamera(ctx: CanvasRenderingContext2D): void {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.translate(w / 2, h / 2);
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.translate(-this.camera.x, -this.camera.y);
  }

  public resetZoom(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  public screenToWorld(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent | TCanvasWheelEvent
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    const transform = this.getCamera();

    let x = e.clientX - rect.left;
    let y = e.clientY - rect.top;

    x = x - ctx.canvas.width / 2;
    y = y - ctx.canvas.height / 2;

    x /= transform.scale;
    y /= transform.scale;

    x += transform.x;
    y += transform.y;

    return {
      x,
      y,
    };
  }

  public worldToScreen(
    ctx: CanvasRenderingContext2D,
    worldPoint: Point
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    const camera = this.getCamera();

    let x = worldPoint.x - camera.x;
    let y = worldPoint.y - camera.y;

    x *= camera.scale;
    y *= camera.scale;

    x = x + ctx.canvas.width / 2;
    y = y + ctx.canvas.height / 2;

    x += rect.left;
    y += rect.top;

    return {
      x,
      y,
    };
  }

  public getCamera(): Camera {
    return this.camera;
  }

  private getZoomIntensity(factor: number): number {
    return Math.exp(factor * this.zoomIntensity);
  }
}

export {CameraManager, type Camera, type CameraBounds};
