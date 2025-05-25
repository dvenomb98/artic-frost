import {TCanvasMouseEvent} from "@core/lib/types";
import {CoreFrame, CoreNode} from "@core/store/store";
import {drawAll, drawNode} from "../draw";
import {Point} from "../types";
import {getCanvasTheme} from "../theme";

class CanvasManager {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    if (!ctx) {
      throw new Error("CanvasManager: ctx is not initialized");
    }

    const theme = getCanvasTheme();

    this.ctx = ctx;

    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.ctx.fillStyle = theme.fillStyle;
    this.ctx.strokeStyle = theme.strokeStyle;

    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public render(nodes: CoreNode[], frame: CoreFrame | null): void {
    this.refill();
    drawAll(this.ctx, nodes, frame);
  }

  public renderNode(node: CoreNode): void {
    drawNode(this.ctx, node);
  }

  private refill(): void {
    this.clear();
    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
  }

  public resize(width: number, height: number): void {
    this.ctx.canvas.width = width;
    this.ctx.canvas.height = height;
    this.ctx.fillRect(0, 0, width, height);
  }

  public getCanvasCoords(e: TCanvasMouseEvent): Point {
    const rect = this.ctx.canvas.getBoundingClientRect();

    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    // TODO: add transform

    return {
      x: rawX,
      y: rawY,
    };
  }

  public getContext(): CanvasRenderingContext2D {
    return this.ctx;
  }
}

export {CanvasManager};
