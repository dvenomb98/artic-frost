import {CoreNode, CoreStoreInstance, NodePointTuple} from "@core/store/store";
import {Point} from "../types";
import {v4} from "uuid";
import {generateNodeProperties, generateTextProperties} from "../theme";
import {detectNodeCollision, HitType} from "../collisions/collisions";
import {getMinMaxPoints} from "../collisions/utils";

class NodeManager {
  private readonly storeInstance: CoreStoreInstance;
  private currentNode: CoreNode | null = null;
  private originalNode: CoreNode | null = null;
  private collision: HitType | null = null;

  constructor(storeInstance: CoreStoreInstance) {
    this.storeInstance = storeInstance;
  }
  /**
   *
   *
   * Add node to the store and set the tool to pointer.
   *
   *
   */
  public finalizeNode(action: "add" | "update", highlight: boolean = true) {
    const store = this.storeInstance.getState();

    const currentNode = this.getCurrentNode();
    if (!currentNode || currentNode.points.length < 2) return false;

    if (highlight) {
      this.highlightCurrentNode();
    } else {
      this.unhighlightCurrentNode();
    }

    if (action === "add") {
      store.addNode(currentNode);
    } else {
      store.updateNode(currentNode);
    }

    store.setTool("pointer");

    return true;
  }
  /**
   *
   *
   * Create a new node. Type is defaulted to the current tool from store.
   *
   *
   */
  public createNode(point: Point) {
    const tool = this.storeInstance.getState().tool;

    if (tool === "pointer" || tool === "frame" || tool === "pan") {
      throw new Error(`createNode: ${tool} is not supported`);
    }

    let node: CoreNode;

    switch (tool) {
      case "rectangle":
      case "line":
        node = {
          id: v4(),
          type: tool,
          points: [[point.x, point.y]] as NodePointTuple,
          properties: generateNodeProperties(tool),
          highlight: false,
        };
        break;
      case "text":
        node = {
          id: v4(),
          type: tool,
          points: [[point.x, point.y]] as NodePointTuple,
          properties: generateNodeProperties(tool),
          highlight: false,
          rawText: "",
          textProperties: generateTextProperties(),
        };
        break;
    }

    this.setNode(node);
  }
  /**
   *
   *
   * Update current node points based on the collision and node type.
   *
   *
   */
  public updatePoints(currentPoint: Point, initialPoint: Point) {
    if (!this.originalNode) {
      throw new Error("updatePoints: current node is not created");
    }

    const updater = this.collisionUpdater(currentPoint, initialPoint);

    switch (this.originalNode.type) {
      case "rectangle":
      case "text":
        updater.rectangle();
        break;
      case "line":
        updater.line();
        break;
    }
  }
  /**
   *
   *
   * Update current node text.
   *
   *
   */
  public updateNodeText(text: string, increment: boolean = true) {
    if (!this.currentNode || this.currentNode.type !== "text") {
      throw new Error("updateNodeText: node is not a text");
    }
    if (increment) {
      this.currentNode.rawText = this.currentNode.rawText + text;
    } else {
      this.currentNode.rawText = text;
    }
  }
  /**
   *
   *
   *
   *
   *
   */
  private collisionUpdater(currentPoint: Point, initialPoint: Point) {
    return {
      rectangle: () => {
        if (!this.originalNode || !this.collision) {
          throw new Error(
            "collisionUpdater: rectangle: node or collision not created. "
          );
        }

        switch (this.collision.type) {
          case "inside":
            this.updatePointsByMove(currentPoint, initialPoint);
            break;

          case "edge":
            const {minX, maxX, minY, maxY} = getMinMaxPoints(
              this.originalNode.points
            );

            const deltaY = currentPoint.y - initialPoint.y;
            const deltaX = currentPoint.x - initialPoint.x;

            switch (this.collision.edge) {
              case "top":
                this.updatePointsByIndex(0, {x: minX, y: minY + deltaY});
                break;
              case "bottom":
                this.updatePointsByIndex(1, {x: maxX, y: maxY + deltaY});
                break;
              case "left":
                this.updatePointsByIndex(0, {x: minX + deltaX, y: minY});
                break;
              case "right":
                this.updatePointsByIndex(1, {x: maxX + deltaX, y: maxY});
                break;
            }
            break;
        }
      },
      line: () => {
        if (!this.originalNode || !this.collision) {
          throw new Error(
            "collisionUpdater: line: node or collision not created."
          );
        }

        switch (this.collision.type) {
          case "inside":
            this.updatePointsByMove(currentPoint, initialPoint);
            break;

          case "control-point":
            switch (this.collision.point) {
              case "start":
                this.updatePointsByIndex(0, {
                  x: currentPoint.x,
                  y: currentPoint.y,
                });
                break;

              case "end":
                this.updatePointsByIndex(1, {
                  x: currentPoint.x,
                  y: currentPoint.y,
                });
                break;
            }
            break;
        }
      },
    };
  }
  /**
   *
   *
   *
   *
   *
   */
  private updatePointsByMove(currentPoint: Point, initialPoint: Point) {
    if (!this.originalNode) {
      throw new Error("collisionUpdater: move: current node is not created");
    }

    const offsetX = currentPoint.x - initialPoint.x;
    const offsetY = currentPoint.y - initialPoint.y;

    for (let i = 0; i < this.originalNode.points.length; i++) {
      const p = this.originalNode.points[i];
      if (!p || !p[0] || !p[1]) continue;
      this.updatePointsByIndex(i, {
        x: p[0] + offsetX,
        y: p[1] + offsetY,
      });
    }
  }
  /**
   *
   *
   *
   *
   *
   */
  public updatePointsByIndex(index: number, point: Point) {
    if (!this.currentNode) {
      throw new Error("updateNodePointsByIndex: node is not created");
    }

    this.currentNode.points[index] = [point.x, point.y];
  }
  /**
   *
   *
   * Detect collisions with all nodes in the store.
   *
   *
   */
  public detectStoreNodesCollisions(point: Point): HitType | null {
    const nodes = this.storeInstance.getState().nodes;

    for (const node of nodes) {
      const collision = detectNodeCollision(point, node);

      if (collision) {
        return collision;
      }
    }

    return null;
  }
  /*
   *
   *
   * Helpers
   *
   *
   */
  public highlightCurrentNode() {
    if (!this.currentNode) {
      return;
    }

    this.currentNode.highlight = true;
  }

  public unhighlightCurrentNode() {
    if (!this.currentNode) {
      return;
    }
    this.currentNode.highlight = false;
  }

  public setFontSize(fontSize: number) {
    if (!this.currentNode || this.currentNode.type !== "text") {
      throw new Error("setInitialFontSize: node is not a text");
    }

    this.currentNode.textProperties.fontSize = fontSize;
  }

  public getCurrentNode(): CoreNode | null {
    return this.currentNode;
  }

  public getOriginalNode(): CoreNode | null {
    return this.originalNode;
  }

  public destroyNodes() {
    this.currentNode = null;
    this.originalNode = null;
  }

  public setCollision(collision: HitType | null) {
    this.collision = collision;
  }

  public setNode(node: CoreNode) {
    if (this.currentNode) {
      throw new Error("setNode: current node is already set");
    }

    if (!this.originalNode) {
      this.originalNode = this.cloneNode(node);
    }
    this.currentNode = this.cloneNode(node);
  }

  private cloneNode(node: CoreNode) {
    return structuredClone(node);
  }
}

export {NodeManager};
