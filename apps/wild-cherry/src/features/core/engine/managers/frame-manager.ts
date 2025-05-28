import {CoreFrame, CoreStoreInstance} from "@core/store/store";
import {v4} from "uuid";
import {Point} from "../types";
import {generateFrameProperties} from "../theme";

class FrameManager {
  private readonly storeInstance: CoreStoreInstance;
  private currentFrame: CoreFrame | null = null;

  constructor(storeInstance: CoreStoreInstance) {
    this.storeInstance = storeInstance;
  }
  /**
   *
   *
   * Create a a new current frame in instance.
   *
   *
   */
  public createFrame(startPoint: Point) {
    this.currentFrame = {
      id: v4(),
      points: [[startPoint.x, startPoint.y]],
      highlight: false,
      properties: generateFrameProperties(),
    };
  }
  /**
   *
   *
   * Update specific point by index in the current frame.
   *
   *
   */
  public updateFramePointsByIndex(index: number, point: Point) {
    if (!this.currentFrame) {
      throw new Error("updateFramePointsByIndex: frame is not created");
    }

    this.currentFrame.points[index] = [point.x, point.y];
  }

  /**
   *
   *
   * Update nodes in the store that are inside the current frame. If there are
   * no nodes inside the frame, the frame will be destroyed. Otherwise, the
   * frame will be updated in the store and the tool will be set to selection.
   *
   *
   */
  public finalizeFrame() {
    if (!this.currentFrame) {
      throw new Error("finalizeFrame: frame is not created");
    }

    const store = this.storeInstance.getState();

    const shouldUpdate = store.highlightNodesInFrame(this.currentFrame);

    if (shouldUpdate) {
      store.setTool("selection");
      store.setFrame(this.currentFrame);
    }

    return shouldUpdate;
  }
  /**
   *
   *
   * Get the current frame.
   *
   *
   */
  public getCurrentFrame() {
    return this.currentFrame;
  }
  /**
   *
   *
   * Destroy the current frame.
   *
   *
   */
  public destroyFrame() {
    this.currentFrame = null;
  }
}

export {FrameManager};
