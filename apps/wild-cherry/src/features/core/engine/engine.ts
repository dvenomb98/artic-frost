import {TCanvasMouseEvent} from "@core/lib/types";
import {type CoreStoreInstance} from "@core/store/store";
import {Point} from "./types";
import {v4} from "uuid";
import {LOGGER} from "@/lib/logger";

import {
  CanvasManager,
  NodeManager,
  TemporaryCanvasManager,
  FrameManager,
} from "./managers";

class DrawingEngine {
  private readonly instanceId: string;
  private readonly storeInstance: CoreStoreInstance;
  private readonly canvasManager: CanvasManager;
  private readonly tempCanvasManager: TemporaryCanvasManager;
  private readonly nodeManager: NodeManager;
  private readonly frameManager: FrameManager;

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
    this.frameManager = new FrameManager(storeInstance);

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
      case "frame": {
        this.handleFrameStart(point);
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
      case "frame": {
        this.handleFrameMove(point);
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
      case "frame": {
        this.handleFrameEnd();
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

    this.tempCanvasManager.renderNode(this.nodeManager.getCurrentNode()!);
  }

  private handleSelectionEnd() {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    const shouldUpdate = this.nodeManager.finalizeNode("update");

    if (shouldUpdate) {
      this.renderMainCanvas();
    }
  }
  /*
   *
   *
   * MULTISELECTIOn
   *
   *
   */
  private handleFrameStart(point: Point) {
    this.frameManager.createFrame(point);
    this.tempCanvasManager.initialize(
      this.frameManager.getCurrentFrame()!.properties
    );
  }

  private handleFrameMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.frameManager.updateFramePointsByIndex(1, point);
    this.tempCanvasManager.renderFrame(this.frameManager.getCurrentFrame()!);

    // TODO: add
    // for node of nodes, highlight if in frame
  }

  private handleFrameEnd() {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    const shouldUpdate = this.frameManager.finalizeFrame();

    if (shouldUpdate) {
      this.renderMainCanvas();
    }
  }
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
      this.nodeManager.getCurrentNode()!.properties
    );
  }

  private handleDrawingMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.nodeManager.updatePointsByIndex(1, point);
    this.tempCanvasManager.renderNode(this.nodeManager.getCurrentNode()!);
  }

  private handleDrawingEnd() {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    const shouldUpdate = this.nodeManager.finalizeNode("add");

    if (shouldUpdate) {
      this.renderMainCanvas();
    }
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
    const isFrameActive = store.frame;

    if (isFrameActive) {
      store.setFrame(null);
    }

    if (shouldUpdate || isFrameActive) {
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
    this.frameManager.destroyFrame();
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
    const start = performance.now();

    const {frame, nodes} = this.getStore();
    this.canvasManager.render(nodes, frame);

    const end = performance.now();

    if (end - start > 16) {
      // more than one frame at 60fps
      LOGGER.warn(`Slow render: ${end - start}ms for ${nodes.length} nodes`);
    }

    LOGGER.log(`Render time: ${end - start}ms`);
  }
}

export {DrawingEngine};
