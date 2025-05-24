import {TEMP_CANVAS_ID} from "../const";
import {TCanvasMouseEvent} from "../lib/types";
import {type CoreStoreInstance, type CoreNode} from "../store/store";
import {getCanvasTheme, getCtx} from "../store/utils";
import {drawNode, drawNodes} from "./draw";
import {Point} from "./types";
import {v4} from "uuid";
import {setCtxPropertiesFromNode} from "./utils";
import {getUpdatedPoints, isPointInsideOrOnBox, isPointOnLine} from "./math";
import {LOGGER} from "@/lib/logger";

class DrawingEngine {
  private ctx: CanvasRenderingContext2D;
  private tempCtx: CanvasRenderingContext2D;

  private properties: CoreNode["properties"];
  private readonly storeInstance: CoreStoreInstance;
  private readonly instanceId: string;
  private initialMousePosition: Point = {x: 0, y: 0};

  private originalNode: CoreNode | null = null;
  private node: CoreNode | null = null;

  constructor(ctx: CanvasRenderingContext2D, storeInstance: CoreStoreInstance) {
    this.instanceId = v4();

    if (!ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.ctx = ctx;
    this.storeInstance = storeInstance;

    this.properties = {
      ...getCanvasTheme(),
      lineWidth: 2,
      lineCap: "round",
      shapeOption: "fill_and_stroke",
    };

    this.tempCtx = getCtx(
      document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement
    );

    LOGGER.log(`DrawingService: instanceId ${this.instanceId}`);
  }

  /**
   *
   *
   * Mouse events
   *
   *
   */
  public onMouseDown(e: TCanvasMouseEvent) {
    const store = this.getStore();
    const point = this.getCanvasCoords(this.ctx, e);
    this.initialMousePosition = point;
    /*
     * Selection tool, finding node from coords.
     */
    switch (store.tool) {
      case "selection": {
        const hit = store.nodes.find(n => {
          if (!n.points[0] || !n.points[1]) {
            LOGGER.error("SelectionService: node has no points");
            return false;
          }

          switch (n.type) {
            case "line": {
              return isPointOnLine(point, n);
            }
            case "rectangle": {
              return isPointInsideOrOnBox(point, n);
            }
            default: {
              return false;
            }
          }
        });

        if (hit) {
          store.setSelectedNode(hit.id);
          this.setNode(hit);
          this.initTempCanvas();
        }

        break;
      }
      /*
       * Other tools, creating a new node.
       */
      default: {
        this.createNode(point);
        this.initTempCanvas();
        drawNode(this.tempCtx, this.getNode().node!, false);
      }
    }
  }

  public onMouseMove(e: TCanvasMouseEvent) {
    const tool = this.getStore().tool;
    const {original, node} = this.getNode();

    if (!original || !node) {
      if (tool === "selection") {
        return;
      }

      throw new Error(
        "onMouseMove: node is not initialized. You should call onMouseDown first."
      );
    }

    switch (tool) {
      /*
       * Selection tool, update position of the current node.
       */
      case "selection": {
        this.clearTempCanvas();
        const point = this.getCanvasCoords(this.ctx, e);

        this.updateNode(
          getUpdatedPoints(original, point, this.initialMousePosition)
        );

        drawNode(this.tempCtx, node, false);

        break;
      }
      /*
       * Other tools, update position of the current node.
       */
      default: {
        const point = this.getCanvasCoords(this.ctx, e);
        this.clearTempCanvas();
        this.updateNodePointsByIndex(1, point);
        drawNode(this.tempCtx, node, false);
      }
    }
  }

  public onMouseUp(e: TCanvasMouseEvent) {
    const store = this.getStore();
    const {node} = this.getNode();

    if (!node) {
      if (store.tool === "selection") {
        return;
      }
      throw new Error(
        "onMouseMove: node is not created. You should call onMouseDown first."
      );
    }

    switch (store.tool) {
      case "selection": {
        const newNodes = store.updateNode(node);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        drawNodes(this.ctx, newNodes);
        store.setSelectedNode(null);
        break;
      }
      default: {
        drawNode(this.ctx, node);
        store.addNode(node);
      }
    }

    this.destroy();
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    this.destroy();
  }

  /**
   *
   *
   * Node
   *
   *
   */
  private createNode(point: Point) {
    const tool = this.getStore().tool;
    if (tool === "selection") {
      throw new Error("createNode: selection is not supported");
    }

    const node = {
      id: v4(),
      type: tool,
      points: [[point.x, point.y]],
      properties: this.properties,
    };

    this.setNode(node);
  }

  private setNode(node: CoreNode) {
    if (!this.originalNode) {
      this.originalNode = structuredClone(node);
    }

    this.node = structuredClone(node);
  }

  private getNode() {
    return {
      original: this.originalNode,
      node: this.node,
    };
  }

  private clearNode() {
    this.originalNode = null;
    this.node = null;
  }

  private updateNode(
    points?: CoreNode["points"],
    properties?: CoreNode["properties"]
  ) {
    if (!points && !properties) {
      return;
    }

    const {node} = this.getNode();

    if (!node) {
      throw new Error("updateNode: node is not created");
    }

    if (points) {
      node.points = points;
    }

    if (properties) {
      node.properties = {...node.properties, ...properties};
    }
  }

  private updateNodePointsByIndex(index: number, point: Point) {
    const {node} = this.getNode();
    if (!node) {
      throw new Error("updateNodePointsByIndex: node is not created");
    }

    node.points[index] = [point.x, point.y];
  }

  /*
   *
   *
   *
   * Canvas utils
   *
   *
   *
   */
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

  private initTempCanvas() {
    const {original} = this.getNode();

    if (!original) {
      throw new Error("initTempCtx: node is not created");
    }

    this.tempCtx.save();

    this.tempCtx.canvas.width = this.ctx.canvas.width;
    this.tempCtx.canvas.height = this.ctx.canvas.height;
    this.tempCtx.canvas.style.display = "block";

    setCtxPropertiesFromNode(this.tempCtx, original.properties);
  }

  private clearTempCanvas() {
    this.tempCtx.clearRect(
      0,
      0,
      this.tempCtx.canvas.width,
      this.tempCtx.canvas.height
    );
  }

  /**
   *
   *
   * Store utils
   *
   *
   */
  private getStore() {
    return this.storeInstance.getState();
  }

  /*
   *
   *
   * Instance managers
   *
   *
   */
  private destroy() {
    this.tempCtx.canvas.style.display = "none";
    this.clearTempCanvas();
    this.clearNode();
    this.initialMousePosition = {x: 0, y: 0};
    this.tempCtx.restore();
  }
}

export {DrawingEngine};
