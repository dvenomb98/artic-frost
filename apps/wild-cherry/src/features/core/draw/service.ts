import {TEMP_CANVAS_ID} from "../const";
import {TCanvasMouseEvent} from "../lib/types";
import {type CoreNode} from "../store/store";
import {getCanvasTheme, getCtx} from "../store/utils";
import {drawNode} from "./draw";
import {Point} from "./types";
import {v4} from "uuid";
import {setCtxPropertiesFromNode} from "./utils";

/**
 * Cache for the temp canvas context.
 */
let _tempCtx: CanvasRenderingContext2D | null = null;

class DrawingService {
  // External
  private ctx: CanvasRenderingContext2D;
  private type: CoreNode["type"];
  private properties: CoreNode["properties"];
  // Internal
  private tempCtx: CanvasRenderingContext2D;
  private node: CoreNode | null = null;

  constructor(
    ctx: CanvasRenderingContext2D | null,
    type: CoreNode["type"],
    properties: CoreNode["properties"]
  ) {
    if (!ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.ctx = ctx;

    this.type = type;

    this.properties = {
      ...getCanvasTheme(),
      ...properties,
    };

    this.tempCtx =
      _tempCtx ||
      getCtx(document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement);

    if (!_tempCtx) {
      _tempCtx = this.tempCtx;
    }
  }

  public onMouseDown(e: TCanvasMouseEvent) {
    const point = this.getCanvasCoords(this.ctx, e);
    this.node = this.createNode(point);
    this.tempCtx.save();

    this.tempCtx.canvas.width = this.ctx.canvas.width;
    this.tempCtx.canvas.height = this.ctx.canvas.height;
    this.tempCtx.canvas.style.display = "block";

    setCtxPropertiesFromNode(this.tempCtx, this.node.properties);

    drawNode(this.tempCtx, this.node, false);
  }

  public onMouseMove(e: TCanvasMouseEvent) {
    if (!this.node) {
      throw new Error(
        "onMouseMove: node is not created. You should call onMouseDown first."
      );
    }

    const point = this.getCanvasCoords(this.ctx, e);

    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );

    this.node.points[1] = [point.x, point.y];
    drawNode(this.tempCtx, this.node, false);
  }

  public onMouseUp(e: TCanvasMouseEvent) {
    if (!this.node) {
      throw new Error(
        "onMouseUp: node is not created. You should call onMouseDown first."
      );
    }

    drawNode(this.ctx, this.node);
    this.clear();
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    this.clear();
  }

  private createNode(point: Point): CoreNode {
    return {
      id: v4(),
      type: this.type,
      points: [[point.x, point.y]],
      properties: this.properties,
    };
  }

  private getCanvasCoords(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  private clear() {
    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );
    this.tempCtx.canvas.style.display = "none";
    this.node = null;
    this.tempCtx.restore();
  }
}

export {DrawingService};
