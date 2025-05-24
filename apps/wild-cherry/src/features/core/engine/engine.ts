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
  private readonly instanceId: string;
  private readonly storeInstance: CoreStoreInstance;

  // Grouped state for better organization
  private canvasState = {
    ctx: null as CanvasRenderingContext2D | null,
    tempCtx: null as CanvasRenderingContext2D | null,
    properties: null as CoreNode["properties"] | null,
    // Prepared for zoom/pan features
    transform: {
      scale: 1,
      offsetX: 0,
      offsetY: 0,
    },
  };

  private interactionState = {
    originalNode: null as CoreNode | null,
    currentNode: null as CoreNode | null,
    initialMousePosition: {x: 0, y: 0} as Point,
    isActive: false,
  };

  constructor(ctx: CanvasRenderingContext2D, storeInstance: CoreStoreInstance) {
    this.instanceId = v4();

    if (!ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.canvasState.ctx = ctx;
    this.storeInstance = storeInstance;
    this.canvasState.properties = {
      ...getCanvasTheme(),
      lineWidth: 2,
      lineCap: "round",
      shapeOption: "fill_and_stroke",
    };

    this.canvasState.tempCtx = getCtx(
      document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement
    );

    LOGGER.log(`DrawingService: instanceId ${this.instanceId}`);
  }

  /**
   * Mouse events
   */
  public onMouseDown(e: TCanvasMouseEvent) {
    const store = this.getStore();
    const point = this.getCanvasCoords(this.canvasState.ctx!, e);

    this.interactionState.initialMousePosition = point;
    this.interactionState.isActive = true;

    if (store.tool === "selection") {
      this.handleSelectionStart(point, store);
    } else {
      this.handleDrawingStart(point);
    }
  }

  public onMouseMove(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;

    const tool = this.getStore().tool;
    const point = this.getCanvasCoords(this.canvasState.ctx!, e);

    this.clearTempCanvas();

    if (tool === "selection") {
      this.handleSelectionMove(point);
    } else {
      this.handleDrawingMove(point);
    }
  }

  public onMouseUp(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;

    const store = this.getStore();

    if (store.tool === "selection") {
      this.handleSelectionEnd(store);
    } else {
      this.handleDrawingEnd(store);
    }

    this.destroy();
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    this.destroy();
  }

  /**
   * Tool-specific handlers - better separation of concerns
   */
  private handleSelectionStart(point: Point, store: any) {
    const hit = this.findNodeAtPoint(point, store.nodes);

    if (hit) {
      store.setSelectedNode(hit.id);
      this.setNode(hit);
      this.initTempCanvas();
    }
  }

  private handleSelectionMove(point: Point) {
    const {originalNode, currentNode} = this.interactionState;

    if (!originalNode || !currentNode) return;

    this.updateNode(
      getUpdatedPoints(
        originalNode,
        point,
        this.interactionState.initialMousePosition
      )
    );

    // Prepared for highlighting selected nodes
    drawNode(this.canvasState.tempCtx!, currentNode, false);
  }

  private handleSelectionEnd(store: any) {
    const {currentNode} = this.interactionState;

    if (!currentNode) return;

    const newNodes = store.updateNode(currentNode);
    this.renderMainCanvas(newNodes);
    store.setSelectedNode(null);
  }

  private handleDrawingStart(point: Point) {
    this.createNode(point);
    this.initTempCanvas();
    drawNode(
      this.canvasState.tempCtx!,
      this.interactionState.currentNode!,
      false
    );
  }

  private handleDrawingMove(point: Point) {
    this.updateNodePointsByIndex(1, point);
    drawNode(
      this.canvasState.tempCtx!,
      this.interactionState.currentNode!,
      false
    );
  }

  private handleDrawingEnd(store: any) {
    const {currentNode} = this.interactionState;

    if (!currentNode) return;

    drawNode(this.canvasState.ctx!, currentNode);
    store.addNode(currentNode);
  }

  /**
   * Node operations - cleaner interface
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
      properties: this.canvasState.properties!,
    };

    this.setNode(node);
  }

  private setNode(node: CoreNode) {
    if (!this.interactionState.originalNode) {
      this.interactionState.originalNode = structuredClone(node);
    }
    this.interactionState.currentNode = structuredClone(node);
  }

  private updateNode(
    points?: CoreNode["points"],
    properties?: CoreNode["properties"]
  ) {
    const {currentNode} = this.interactionState;

    if (!currentNode || (!points && !properties)) return;

    if (points) currentNode.points = points;
    if (properties) {
      currentNode.properties = {...currentNode.properties, ...properties};
    }
  }

  private updateNodePointsByIndex(index: number, point: Point) {
    const {currentNode} = this.interactionState;

    if (!currentNode) {
      throw new Error("updateNodePointsByIndex: node is not created");
    }

    currentNode.points[index] = [point.x, point.y];
  }

  /**
   * Hit testing - extracted for clarity and future extensibility
   */
  private findNodeAtPoint(
    point: Point,
    nodes: CoreNode[]
  ): CoreNode | undefined {
    return nodes.find(node => {
      if (!node.points[0] || !node.points[1]) {
        LOGGER.error("SelectionService: node has no points");
        return false;
      }

      switch (node.type) {
        case "line":
          return isPointOnLine(point, node);
        case "rectangle":
          return isPointInsideOrOnBox(point, node);
        default:
          return false;
      }
    });
  }

  /**
   * Canvas operations - prepared for zoom/pan
   */
  private getCanvasCoords(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    const {transform} = this.canvasState;

    // Transform-aware coordinates (ready for zoom/pan)
    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    return {
      x: (rawX - transform.offsetX) / transform.scale,
      y: (rawY - transform.offsetY) / transform.scale,
    };
  }

  private initTempCanvas() {
    const {originalNode} = this.interactionState;
    const {tempCtx} = this.canvasState;

    if (!originalNode || !tempCtx) {
      throw new Error("initTempCtx: node or tempCtx not available");
    }

    tempCtx.save();
    tempCtx.canvas.width = this.canvasState.ctx!.canvas.width;
    tempCtx.canvas.height = this.canvasState.ctx!.canvas.height;
    tempCtx.canvas.style.display = "block";

    setCtxPropertiesFromNode(tempCtx, originalNode.properties);
  }

  private clearTempCanvas() {
    const {tempCtx} = this.canvasState;
    if (!tempCtx) return;

    tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
  }

  private renderMainCanvas(nodes: CoreNode[]) {
    const {ctx} = this.canvasState;
    if (!ctx) return;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawNodes(ctx, nodes);
  }

  /**
   * Utilities
   */
  private getStore() {
    return this.storeInstance.getState();
  }

  private destroy() {
    const {tempCtx} = this.canvasState;

    if (tempCtx) {
      tempCtx.canvas.style.display = "none";
      this.clearTempCanvas();
      tempCtx.restore();
    }

    this.interactionState = {
      originalNode: null,
      currentNode: null,
      initialMousePosition: {x: 0, y: 0},
      isActive: false,
    };
  }
}

export {DrawingEngine};
