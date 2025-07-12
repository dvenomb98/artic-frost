import {
  TCanvasKeyDownEvent,
  TCanvasMouseEvent,
  TCanvasWheelEvent,
} from "@core/lib/types";
import {type CoreStoreInstance} from "@core/store/store";
import {Point} from "./types";
import {v4} from "uuid";
import {LOGGER} from "@/lib/logger";

import {
  CanvasManager,
  NodeManager,
  TemporaryCanvasManager,
  FrameManager,
  CameraManager,
} from "./managers";

import {verifyPerformance} from "./utils";
import {debounce} from "@/lib/utils";
import {DrawManager} from "./managers/draw-manager";
import {getCharFromEvent} from "./text";

class DrawingEngine {
  private readonly instanceId: string;
  private readonly storeInstance: CoreStoreInstance;
  private readonly cameraManager: CameraManager;
  private readonly canvasManager: CanvasManager;
  private readonly tempCanvasManager: TemporaryCanvasManager;
  private readonly nodeManager: NodeManager;
  private readonly frameManager: FrameManager;
  private readonly drawManager: DrawManager;

  private interactionState = {
    initialMousePosition: {x: 0, y: 0} as Point,
    isActive: false,
    isWheelActive: false,
  };

  private textEditingState = {
    isEditing: false,
    nodeId: "",
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
    this.drawManager = new DrawManager(
      storeInstance,
      this.cameraManager,
      this.nodeManager
    );

    this.canvasManager = new CanvasManager(
      ctx,
      this.cameraManager,
      this.drawManager
    );

    this.tempCanvasManager = new TemporaryCanvasManager(
      ctx,
      this.cameraManager,
      this.nodeManager,
      this.frameManager,
      this.drawManager
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
      case "pointer": {
        this.pointerMethods().handlePointerStart(point);
        break;
      }
      case "frame": {
        this.frameMethods().handleFrameStart(point);
        break;
      }
      default:
        this.drawingMethods().handleDrawingStart(point);
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
      case "pointer": {
        this.pointerMethods().handlePointerMove(point);
        break;
      }
      case "frame": {
        this.frameMethods().handleFrameMove(point);
        break;
      }
      default:
        this.drawingMethods().handleDrawingMove(point);
    }
  }

  public onMouseUp(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;

    const store = this.getStore();

    switch (store.tool) {
      case "pointer": {
        this.pointerMethods().handlePointerEnd();
        break;
      }
      case "frame": {
        this.frameMethods().handleFrameEnd();
        break;
      }
      default:
        this.drawingMethods().handleDrawingEnd();
    }
  }

  public onMouseLeave(e: TCanvasMouseEvent) {
    if (!this.interactionState.isActive) return;
    this.destroy();
  }

  public onWheel(e: TCanvasWheelEvent) {
    this.wheelMethods().handleWheelStart();

    this.cameraManager.setZoomByWheelEvent(this.canvasManager.getContext(), e);
    this.renderMainCanvas();

    this.wheelMethods().handleWheelEnd();
  }

  public onKeyDown(e: TCanvasKeyDownEvent) {
    e.preventDefault();

    if (this.textEditingState.isEditing) {
      this.textEditingMethods().handleTextEditingStart();
      this.textEditingMethods().handleKeyDown(e);
    }
  }
  /*
   *
   *
   * PUBLIC METHODS
   *
   *
   */
  public renderMainCanvas(): void {
    verifyPerformance(() => {
      this.canvasManager.render();
    }, "renderMainCanvas");
  }

  public zoom(type: "in" | "out") {
    const factor = type === "in" ? 2 : -2;
    this.cameraManager.setCamera(factor);
    this.renderMainCanvas();
  }

  public getCameraManager() {
    return this.cameraManager;
  }
  /*
   *
   *
   * PRIVATE METHODS
   *
   *
   */
  private pointerMethods() {
    return {
      handlePointerStart: (point: Point) => {
        const collision = this.nodeManager.detectStoreNodesCollisions(point);

        if (!collision) return;

        this.nodeManager.setNode(collision.node);
        this.nodeManager.setCollision(collision);
        this.canvasManager.setCursorBasedOnCollision(collision);
        this.tempCanvasManager.initialize("node");
        this.tempCanvasManager.renderNode();
        // only for text nodes;
        this.startTextInteractionState();
        // rerender main canvas to omit current node from
        this.renderMainCanvas();
      },
      handlePointerMove: (point: Point) => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        this.nodeManager.updatePoints(
          point,
          this.interactionState.initialMousePosition
        );

        this.tempCanvasManager.renderNode();
      },
      handlePointerEnd: () => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        const shouldUpdate = this.nodeManager.finalizeNode("update");

        this.destroy();

        if (shouldUpdate) {
          this.renderMainCanvas();
        }
      },
    };
  }
  /*
   *
   */
  private frameMethods() {
    return {
      handleFrameStart: (point: Point) => {
        this.frameManager.createFrame(point);
        this.tempCanvasManager.initialize("frame");
      },
      handleFrameMove: (point: Point) => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        this.frameManager.updateFramePointsByIndex(1, point);
        this.tempCanvasManager.renderFrame();
      },
      handleFrameEnd: () => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        const shouldUpdate = this.frameManager.finalizeFrame();

        this.destroy();

        if (shouldUpdate) {
          this.renderMainCanvas();
        }
      },
    };
  }
  /*
   *
   */
  private drawingMethods() {
    return {
      handleDrawingStart: (point: Point) => {
        this.nodeManager.createNode(point);
        this.tempCanvasManager.initialize("node");
      },
      handleDrawingMove: (point: Point) => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        this.nodeManager.updatePointsByIndex(1, point);
        this.tempCanvasManager.renderNode();
      },
      handleDrawingEnd: () => {
        if (!this.tempCanvasManager.getIsInitialized()) return;

        const shouldUpdate = this.nodeManager.finalizeNode("add");

        this.startTextInteractionState();

        this.destroy();

        if (shouldUpdate) {
          this.renderMainCanvas();
        }
      },
    };
  }
  /*
   *
   */
  private wheelMethods() {
    return {
      handleWheelStart: () => {
        if (!this.interactionState.isWheelActive) {
          this.interactionState.isWheelActive = true;
          this.storeInstance
            .getState()
            .setIsCameraActive(this.interactionState.isWheelActive);
        }
      },
      handleWheelEnd: debounce(() => {
        const store = this.getStore();
        this.interactionState.isWheelActive = false;
        store.setIsCameraActive(this.interactionState.isWheelActive);
      }, 100),
    };
  }
  /*
   *
   */
  private textEditingMethods() {
    return {
      handleTextEditingStart: () => {
        const node = this.nodeManager.getCurrentNode();

        if (!node) {
          const store = this.getStore();
          const findedNode = store.nodes.find(
            node => node.id === this.textEditingState.nodeId
          );

          if (!findedNode) {
            throw new Error(
              "textEditingMethods: node not found. You probably forgot to start text editing mode."
            );
          }

          this.nodeManager.setNode(findedNode);
          this.tempCanvasManager.initialize("node");
        }
      },
      handleKeyDown: (e: TCanvasKeyDownEvent) => {
        const node = this.nodeManager.getCurrentNode();

        if (!node || node.type !== "text") {
          throw new Error(
            "textEditingMethods: node not found. You probably forgot to start text editing mode."
          );
        }

        switch (e.key) {
          case "Escape": {
            this.textEditingMethods().handleTextEditingEnd(true);
            break;
          }
          case "Backspace": {
            const removedText = node.rawText.slice(0, -1);
            this.nodeManager.updateNodeText(removedText, false);
            this.tempCanvasManager.renderNode();
            break;
          }
          default:
            {
              const text = getCharFromEvent(e);
              if (text) {
                this.nodeManager.updateNodeText(text);
                this.tempCanvasManager.renderNode();
              }
            }
            break;
        }
      },
      handleTextEditingEnd: (renderMainCanvas: boolean) => {
        if (!this.textEditingState.isEditing) return false;

        this.stopTextInteractionState();
        this.nodeManager.finalizeNode("update", false);

        this.destroy();

        if (renderMainCanvas) {
          this.renderMainCanvas();
        }
      },
    };
  }
  /*
   *
   *
   * SHARED BETWEEN
   *
   *
   */
  private startInteraction(point: Point) {
    // cancel previous interactions
    this.textEditingMethods().handleTextEditingEnd(false);

    this.interactionState.isActive = true;
    this.interactionState.initialMousePosition = point;

    const store = this.getStore();

    store.unhighlightAllNodes();

    this.renderMainCanvas();
  }

  private startTextInteractionState() {
    const node = this.nodeManager.getCurrentNode();

    if (!node || node.type !== "text") return;

    this.textEditingState = {
      isEditing: true,
      nodeId: node.id,
    };
  }

  private stopTextInteractionState() {
    if (!this.textEditingState.isEditing) return;

    this.textEditingState = {
      isEditing: false,
      nodeId: "",
    };
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
  /**
   *
   *
   * CLEANUP
   * @important On the last interaction, should be called before renderMainCanvas
   *
   *
   */
  private destroy() {
    this.tempCanvasManager.destroy();
    this.canvasManager.destroy();
    this.nodeManager.destroyNodes();
    this.frameManager.destroyFrame();
    this.interactionState = {
      initialMousePosition: {x: 0, y: 0},
      isActive: false,
      isWheelActive: false,
    };
  }
}

export {DrawingEngine};
