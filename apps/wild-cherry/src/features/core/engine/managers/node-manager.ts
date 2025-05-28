import {CoreNode, CoreStoreInstance, NodePointTuple} from "@core/store/store";
import {Point} from "../types";
import {v4} from "uuid";
import {generateNodeProperties} from "../theme";
import {isPointInsideOrOnBox, isPointOnLine} from "../collisions";
import {LOGGER} from "@/lib/logger";
import {getUpdatedPoints} from "../utils";

class NodeManager {
  private readonly storeInstance: CoreStoreInstance;
  private currentNode: CoreNode | null = null;
  private originalNode: CoreNode | null = null;

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
  public finalizeNode(action: "add" | "update") {
    this.highlightCurrentNode();
    const store = this.storeInstance.getState();

    const currentNode = this.getCurrentNode();
    if (!currentNode || currentNode.points.length < 2) return false;

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

    if (tool === "pointer" || tool === "frame") {
      throw new Error(`createNode: ${tool} is not supported`);
    }

    const node = {
      id: v4(),
      type: tool,
      points: [[point.x, point.y]] as NodePointTuple,
      properties: generateNodeProperties(tool),
      highlight: false,
    };

    this.setNode(node);
  }

  /**
   *
   *
   * Clone current node and update it with the given properties.
   *
   *
   */
  public updateNode(
    props?: Partial<CoreNode> & {properties?: Partial<CoreNode["properties"]>}
  ) {
    if (!this.currentNode) {
      throw new Error("updateNode: node is not created");
    }

    if (!props) return;

    const updatedNode = this.cloneNode(this.currentNode);

    if (props.highlight) {
      updatedNode.highlight = true;
    }
    if (props.properties) {
      updatedNode.properties = {
        ...this.currentNode.properties,
        ...props.properties,
      };
    }
    if (props.points) {
      updatedNode.points = props.points;
    }

    this.currentNode = updatedNode;
  }
  /**
   *
   *
   * Update all points in the node relative to the mouse position.
   *
   *
   */
  public updatePoints(currentPoint: Point, initialPoint: Point) {
    if (!this.originalNode) {
      throw new Error("updatePoints: original node is not created");
    }

    const updatedPoints = getUpdatedPoints(
      this.originalNode,
      currentPoint,
      initialPoint
    );

    this.updateNode({points: updatedPoints});
  }

  /**
   *
   *
   * Update only specific point in the node.
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
   * Find a node at a point. Default nodes are stored in the store.
   *
   *
   */
  public findNodeAtPoint(point: Point): CoreNode | undefined {
    const nodes = this.storeInstance.getState().nodes;
    return nodes.find(node => {
      if (!node.points[0] && !node.points[1]) {
        LOGGER.error("NodeManager: node has no points");
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

  public highlightCurrentNode() {
    if (!this.currentNode) {
      return;
    }

    const updatedNode = this.cloneNode(this.currentNode);
    updatedNode.highlight = true;
    this.currentNode = updatedNode;
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

  public setNode(node: CoreNode) {
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
