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
    isTempCanvasInitialized: false,
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
    if (!ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.instanceId = v4();

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

  /*
   *
   *
   * EVENT HANDLERS
   *
   *
   */
  public onMouseDown(e: TCanvasMouseEvent) {
    const store = this.getStore();
    const point = this.getCanvasCoords(this.canvasState.ctx!, e);

    this.startInteraction(point);

    if (store.tool === "selection") {
      this.handleSelectionStart(point);
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
      this.handleSelectionEnd();
    } else {
      this.handleDrawingEnd();
    }

    this.destroy();
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    this.destroy();
  }

  /*
   *
   *
   * EVENT HELPERS
   *
   *
   */
  private handleSelectionStart(point: Point) {
    const hit = this.findNodeAtPoint(point);

    if (hit) {
      this.setNode(hit);
      this.initTempCanvas();
    }
  }

  private handleSelectionMove(point: Point) {
    const {originalNode, currentNode} = this.interactionState;
    if (!originalNode || !currentNode) return;

    this.updateNode({
      points: getUpdatedPoints(
        originalNode,
        point,
        this.interactionState.initialMousePosition
      ),
    });

    drawNode(this.canvasState.tempCtx!, currentNode);
  }

  private handleSelectionEnd() {
    const {currentNode} = this.interactionState;
    if (!currentNode || currentNode.points.length < 2) return;

    this.updateNode({highlight: true});

    const store = this.getStore();
    store.updateNode(currentNode);
    this.renderMainCanvas();
  }

  private handleDrawingStart(point: Point) {
    this.createNode(point);
    this.initTempCanvas();
  }

  private handleDrawingMove(point: Point) {
    this.updateNodePointsByIndex(1, point);
    drawNode(
      this.canvasState.tempCtx!,
      this.interactionState.currentNode!,
      false
    );
  }

  private handleDrawingEnd() {
    const {currentNode} = this.interactionState;
    if (!currentNode || currentNode.points.length < 2) return;

    this.updateNode({highlight: true});
    const store = this.getStore();
    store.addNode(currentNode);
    drawNode(this.canvasState.ctx!, currentNode);
  }

  private startInteraction(point: Point) {
    this.interactionState.isActive = true;
    this.interactionState.initialMousePosition = point;

    const store = this.getStore();
    store.unhighlightAllNodes();
    this.renderMainCanvas();
  }

  /*
   *
   *
   * NODE MANAGEMENT
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
      properties: this.canvasState.properties!,
      highlight: false,
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
    props?: Partial<CoreNode> & {properties?: Partial<CoreNode["properties"]>}
  ) {
    if (!this.interactionState.currentNode) {
      throw new Error("updateNode: node is not created");
    }

    if (!props) return;

    if (props.highlight) {
      this.interactionState.currentNode.highlight = true;
    }
    if (props.properties) {
      this.interactionState.currentNode.properties = {
        ...this.interactionState.currentNode.properties,
        ...props.properties,
      };
    }
    if (props.points) {
      this.interactionState.currentNode.points = props.points;
    }
  }

  private updateNodePointsByIndex(index: number, point: Point) {
    const {currentNode} = this.interactionState;

    if (!currentNode) {
      throw new Error("updateNodePointsByIndex: node is not created");
    }

    currentNode.points[index] = [point.x, point.y];
  }

  private findNodeAtPoint(point: Point): CoreNode | undefined {
    const nodes = this.getStore().nodes;
    return nodes.find(node => {
      if (!node.points[0] && !node.points[1]) {
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

  /*
   *
   *
   * UTILS
   *
   *
   */
  private getCanvasCoords(
    ctx: CanvasRenderingContext2D,
    e: TCanvasMouseEvent
  ): Point {
    const rect = ctx.canvas.getBoundingClientRect();
    const {transform} = this.canvasState;

    const rawX = e.clientX - rect.left;
    const rawY = e.clientY - rect.top;

    return {
      x: (rawX - transform.offsetX) / transform.scale,
      y: (rawY - transform.offsetY) / transform.scale,
    };
  }

  /*
   *
   *
   * SCENE RENDERING
   *
   *
   */
  private renderMainCanvas() {
    const {ctx} = this.canvasState;
    if (!ctx) return;

    const nodes = this.getStore().nodes;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    drawNodes(ctx, nodes);
  }

  private clearTempCanvas() {
    const {tempCtx} = this.canvasState;
    if (!tempCtx) return;

    tempCtx.clearRect(0, 0, tempCtx.canvas.width, tempCtx.canvas.height);
  }

  private initTempCanvas() {
    const {originalNode} = this.interactionState;
    const {tempCtx, isTempCanvasInitialized} = this.canvasState;

    if (!originalNode || !tempCtx) {
      throw new Error("initTempCtx: node or tempCtx not available");
    }

    if (isTempCanvasInitialized) {
      throw new Error("initTempCtx: tempCtx already initialized!");
    }

    tempCtx.save();
    tempCtx.canvas.width = this.canvasState.ctx!.canvas.width;
    tempCtx.canvas.height = this.canvasState.ctx!.canvas.height;
    tempCtx.canvas.style.display = "block";

    setCtxPropertiesFromNode(tempCtx, originalNode.properties);
  }

  /*
   *
   *
   * STORE MANAGEMENT
   *
   *
   */
  private getStore() {
    return this.storeInstance.getState();
  }
  /*
   *
   *
   * CLEANUP
   *
   *
   */
  private destroy() {
    const {tempCtx} = this.canvasState;

    if (tempCtx) {
      tempCtx.canvas.style.display = "none";
      this.clearTempCanvas();
      tempCtx.restore();
      this.canvasState.isTempCanvasInitialized = false;
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
