import {TCanvasMouseEvent} from "@core/lib/types";
import {type CoreStoreInstance} from "@core/store/store";
import {Point} from "./types";
import {v4} from "uuid";
import {LOGGER} from "@/lib/logger";

import {CanvasManager, NodeManager, TemporaryCanvasManager} from "./managers";

class DrawingEngine {
  private readonly instanceId: string;
  private readonly storeInstance: CoreStoreInstance;
  private readonly canvasManager: CanvasManager;
  private readonly tempCanvasManager: TemporaryCanvasManager;
  private readonly nodeManager: NodeManager;

  private interactionState = {
    initialMousePosition: {x: 0, y: 0} as Point,
    isActive: false,
  };

  constructor(ctx: CanvasRenderingContext2D, storeInstance: CoreStoreInstance) {
    if (!ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.instanceId = v4();

    this.storeInstance = storeInstance;
    this.canvasManager = new CanvasManager(ctx);
    this.tempCanvasManager = new TemporaryCanvasManager(ctx);
    this.nodeManager = new NodeManager(storeInstance);

    LOGGER.log(`Engine started: ${this.instanceId}`);
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
    const point = this.canvasManager.getCanvasCoords(e);

    this.startInteraction(point);

    switch (store.tool) {
      case "selection": {
        this.handleSelectionStart(point);
        break;
      }
      case "multiselection": {
        this.handleMultiselectionStart(point);
        break;
      }
      default:
        this.handleDrawingStart(point);
    }
  }

  public onMouseMove(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;

    const tool = this.getStore().tool;
    const point = this.canvasManager.getCanvasCoords(e);

    this.tempCanvasManager.clear();

    switch (tool) {
      case "selection": {
        this.handleSelectionMove(point);
        break;
      }
      case "multiselection": {
        break;
      }
      default:
        this.handleDrawingMove(point);
    }
  }

  public onMouseUp(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;
    const store = this.getStore();

    switch (store.tool) {
      case "selection": {
        this.handleSelectionEnd();
        break;
      }
      case "multiselection": {
        break;
      }
      default:
        this.handleDrawingEnd();
    }

    this.destroy();
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;
    this.destroy();
  }

  /*
   *
   *
   * SELECTION
   *
   *
   */
  private handleSelectionStart(point: Point) {
    const hit = this.nodeManager.findNodeAtPoint(point);

    if (hit) {
      this.nodeManager.setNode(hit);
      this.tempCanvasManager.initialize(hit.properties);
    }
  }

  private handleSelectionMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.nodeManager.updatePoints(
      point,
      this.interactionState.initialMousePosition
    );

    this.tempCanvasManager.drawNode(this.nodeManager.getCurrentNode()!);
  }

  private handleSelectionEnd() {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.nodeManager.highlightCurrentNode();
    const store = this.getStore();

    const currentNode = this.nodeManager.getCurrentNode();
    if (!currentNode || currentNode.points.length < 2) return;

    store.updateNode(currentNode);
    this.renderMainCanvas();
  }
  /*
   *
   *
   * MULTISELECTIOn
   *
   *
   */

  private handleMultiselectionStart(point: Point) {
    this.tempCanvasManager.initialize();
  }

  private handleMultiselectionMove(point: Point) {}

  private handleMultiselectionEnd() {}

  /*
   *
   *
   * DRAWING
   *
   *
   */

  private handleDrawingStart(point: Point) {
    this.nodeManager.createNode(point);
    this.tempCanvasManager.initialize(
      this.nodeManager.getOriginalNode()?.properties
    );
  }

  private handleDrawingMove(point: Point) {
    this.nodeManager.updatePointsByIndex(1, point);
    this.tempCanvasManager.drawNode(this.nodeManager.getCurrentNode()!);
  }

  private handleDrawingEnd() {
    this.nodeManager.highlightCurrentNode();
    const store = this.getStore();

    const currentNode = this.nodeManager.getCurrentNode();
    if (!currentNode || currentNode.points.length < 2) return;

    store.addNode(currentNode);
    store.setTool("selection");
    this.canvasManager.renderNode(currentNode);
  }

  /*
   *
   *
   * INTERACTION
   *
   *
   */

  private startInteraction(point: Point) {
    this.interactionState.isActive = true;
    this.interactionState.initialMousePosition = point;

    const store = this.getStore();

    const {shouldUpdate} = store.unhighlightAllNodes();

    if (shouldUpdate) {
      this.renderMainCanvas();
    }
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
    this.tempCanvasManager.destroy();
    this.nodeManager.destroyNodes();
    this.interactionState = {
      initialMousePosition: {x: 0, y: 0},
      isActive: false,
    };
  }

  /*
   *
   *
   * PUBLIC METHODS
   *
   *
   */

  public renderMainCanvas(): void {
    const nodes = this.getStore().nodes;
    this.canvasManager.render(nodes);
  }
}

export {DrawingEngine};
