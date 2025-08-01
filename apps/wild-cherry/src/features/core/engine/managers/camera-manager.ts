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

  /**
   * Translates a mouse wheel event into a zoom action. The zoom is centered
   * on the mouse pointer's position in world coordinates.
   */
  public zoomByWheelEvent(
    ctx: CanvasRenderingContext2D,
    e: TCanvasWheelEvent
  ): void {
    const zoomFactor = e.deltaY < 0 ? 1 : -1;
    const mouse = this.screenToWorld(ctx, e);
    this.zoom(zoomFactor, {x: mouse.x, y: mouse.y});
  }

  /**
   * Sets the camera's zoom level and position. The core of the zoom logic.
   * It calculates a new scale and then adjusts the camera's (x, y) coordinates
   * to create the effect of zooming towards a specific point (the zoom center).
   * @param factor A number determining the direction and intensity of the zoom.
   * @param center The point (in world coordinates) to zoom towards. If not provided,
   * it defaults to the current camera position.
   */
  public zoom(factor: number, center?: Point): void {
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

    // This formula adjusts the camera's position to keep the zoom centered.
    // It calculates the vector from the zoom center to the camera's current position,
    // scales that vector by the zoom factor, and then adds it back to the zoom
    // center to get the new camera position. This makes it feel like we are
    // zooming in or out from the `center` point.
    this.camera.x = zoomCenterX + (this.camera.x - zoomCenterX) / actualFactor;
    this.camera.y = zoomCenterY + (this.camera.y - zoomCenterY) / actualFactor;
    this.camera.scale = newScale;

    this.syncToStore();
  }

  /**
   * Applies the camera's transformation (pan and zoom) to the canvas context.
   * The order of operations is crucial:
   * 1. Translate to the center of the canvas. This makes zooming and panning relative to the viewport's center.
   * 2. Scale by the camera's zoom level.
   * 3. Translate by the camera's negative position. This effectively "moves the world" under the camera.
   *
   * This method should be called at the beginning of each render cycle, before any drawing
   * operations, to ensure the scene is viewed from the correct perspective. It is typically
   * paired with `ctx.save()` before and `ctx.restore()` after.
   */
  public applyCamera(ctx: CanvasRenderingContext2D): void {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;

    ctx.translate(w / 2, h / 2);
    ctx.scale(this.camera.scale, this.camera.scale);
    ctx.translate(-this.camera.x, -this.camera.y);
  }

  /**
   * Resets the canvas context's transformation matrix to its default state (identity matrix).
   * This effectively removes any panning or zooming.
   * @param ctx The canvas rendering context.
   */
  public resetZoom(ctx: CanvasRenderingContext2D): void {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }

  /**
   * Gets a point from a mouse event, converting it to the correct coordinate system
   * based on the currently selected tool.
   * - For the "pan" tool, it returns screen coordinates because panning is a screen-space operation.
   * - For all other tools, it returns world coordinates.
   * @returns A point in either screen or world coordinates.
   */
  public getPointFromEventBasedOnTool(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent
  ): Point {
    const tool = this.storeInstance.getState().tool;
    if (tool === "pan") {
      return this.getRawPoint(ctx, e);
    }
    return this.screenToWorld(ctx, e);
  }

  /**
   * Converts a point from world coordinates (the coordinate system of the scene)
   * to screen coordinates (the pixel coordinates on the user's display).
   * @returns The equivalent point in screen coordinates.
   */
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

  /**
   * Converts a point from screen coordinates (e.g., a mouse click) to world coordinates,
   * taking into account the camera's current pan and zoom.
   * This is the inverse operation of `worldToScreen`.
   * @returns The equivalent point in world coordinates.
   */
  private screenToWorld(
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

  /**
   * Gets the raw x/y coordinates of a mouse event relative to the canvas element's top-left corner.
   * This does not account for camera pan or zoom.
   * @returns A point in screen-space, relative to the canvas.
   */
  private getRawPoint(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  /**
   * Updates the camera's x and y position based on mouse movement to create a panning effect.
   * It calculates the mouse's delta movement and applies it to the initial camera position.
   * The division by `this.camera.scale` is important to ensure the panning speed feels
   * consistent regardless of the zoom level.
   */
  public pan({
    initialCameraPosition,
    initialMousePosition,
    point,
  }: {
    initialCameraPosition: Point;
    initialMousePosition: Point;
    point: Point;
  }): void {
    const dx = point.x - initialMousePosition.x;
    const dy = point.y - initialMousePosition.y;

    const x = initialCameraPosition.x - dx / this.camera.scale;
    const y = initialCameraPosition.y - dy / this.camera.scale;

    this.camera.x = x;
    this.camera.y = y;

    this.syncToStore();
  }

  /**
   * Returns the current camera state.
   * @returns The camera object.
   */
  public getCamera(): Camera {
    return this.camera;
  }

  /**
   * Calculates the zoom intensity factor based on an exponential curve.
   * This creates a smoother, more natural-feeling zoom.
   * @param factor A number determining the direction of the zoom.
   * @returns The calculated zoom intensity.
   */
  private getZoomIntensity(factor: number): number {
    return Math.exp(factor * this.zoomIntensity);
  }
}

export {CameraManager, type Camera, type CameraBounds};
