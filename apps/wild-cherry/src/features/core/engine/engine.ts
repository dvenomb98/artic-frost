import {TCanvasMouseEvent, TCanvasWheelEvent} from "@core/lib/types";
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
import {CameraManager} from "./managers/camera-manager";
import {verifyPerformance} from "./utils";

class DrawingEngine {
  private readonly instanceId: string;
  private readonly storeInstance: CoreStoreInstance;
  private readonly cameraManager: CameraManager;
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
    this.cameraManager = new CameraManager(storeInstance);
    this.nodeManager = new NodeManager(storeInstance);
    this.frameManager = new FrameManager(storeInstance);

    this.canvasManager = new CanvasManager(ctx, this.cameraManager);
    this.tempCanvasManager = new TemporaryCanvasManager(
      ctx,
      this.cameraManager,
      this.nodeManager,
      this.frameManager
    );

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
    const point = this.cameraManager.screenToWorld(
      this.canvasManager.getContext(),
      e
    );

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
    const point = this.cameraManager.screenToWorld(
      this.canvasManager.getContext(),
      e
    );

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

  public onWheel(e: TCanvasWheelEvent) {
    this.cameraManager.setZoomByWheelEvent(this.canvasManager.getContext(), e);
    this.renderMainCanvas();
  }
  /*
   *
   *
   * PUBLIC METHODS
   *
   *
   */

  public renderMainCanvas(): void {
    const {frame, nodes, isGridVisible} = this.getStore();

    verifyPerformance(() => {
      this.canvasManager.render(nodes, frame, isGridVisible);
    }, "renderMainCanvas");
  }

  public zoom(type: "in" | "out") {
    const factor = type === "in" ? 2 : -2;
    this.cameraManager.setCamera(factor);
    this.renderMainCanvas();
  }
  /*
   *
   *
   * PUBLIC MANAGERS
   *
   *
   */
  public getCameraManager() {
    return this.cameraManager;
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
      this.tempCanvasManager.initialize("node");
    }
  }

  private handleSelectionMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.nodeManager.updatePoints(
      point,
      this.interactionState.initialMousePosition
    );

    this.tempCanvasManager.renderNode();
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
    this.tempCanvasManager.initialize("frame");
  }

  private handleFrameMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.frameManager.updateFramePointsByIndex(1, point);
    this.tempCanvasManager.renderFrame();

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
    this.tempCanvasManager.initialize("node");
  }

  private handleDrawingMove(point: Point) {
    if (!this.tempCanvasManager.getIsInitialized()) return;

    this.nodeManager.updatePointsByIndex(1, point);
    this.tempCanvasManager.renderNode();
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
}

export {DrawingEngine};
