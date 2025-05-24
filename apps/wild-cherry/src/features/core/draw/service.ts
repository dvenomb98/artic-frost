import {TEMP_CANVAS_ID} from "../const";
import {TCanvasMouseEvent} from "../lib/types";
import {CoreStore, type CoreNode} from "../store/store";
import {getCanvasTheme, getCtx} from "../store/utils";
import {drawNode, drawNodes} from "./draw";
import {Point} from "./types";
import {v4} from "uuid";
import {setCtxPropertiesFromNode} from "./utils";
import {getUpdatedPoints, isPointInsideOrOnBox, isPointOnLine} from "./math";

/**
 * Cache
 */
let _tempCtx: CanvasRenderingContext2D;
let _node: CoreNode | null = null;

class DrawingService {
  // External
  private ctx: CanvasRenderingContext2D;
  private properties: CoreNode["properties"];
  private readonly store: CoreStore;

  constructor(store: CoreStore, properties: CoreNode["properties"]) {
    if (!store.ctx) {
      throw new Error("DrawingService: ctx is not initialized");
    }

    this.ctx = store.ctx;
    this.store = store;

    this.properties = {
      ...getCanvasTheme(),
      ...properties,
    };

    const tempCtx =
      _tempCtx ||
      getCtx(document.getElementById(TEMP_CANVAS_ID) as HTMLCanvasElement);

    if (!_tempCtx) {
      _tempCtx = tempCtx;
    }
  }

  /**
   *
   * Mouse down event.
   * @param e - Mouse event.
   *
   */
  public onMouseDown(e: TCanvasMouseEvent) {
    const point = this.getCanvasCoords(this.ctx, e);
    /*
     * Selection tool, finding node from coords.
     */
    switch (this.store.tool) {
      case "selection": {
        const hit = this.store.nodes.find(n => {
          if (!n.points[0] || !n.points[1]) {
            console.error("SelectionService: node has no points");
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
          _node = this.copyNode(hit);
          this.store.setSelectedNode(_node);
          this.initTempCtxProps(_node);
        }

        break;
      }
      /*
       * Other tools, creating a new node.
       */
      default: {
        _node = this.createNode(point);
        this.initTempCtxProps(_node);
        drawNode(_tempCtx, _node, false);
      }
    }
  }

  /**
   *
   * Mouse move event.
   * @param e - Mouse event.
   *
   */
  public onMouseMove(e: TCanvasMouseEvent) {
    if (!_node) {
      if (this.store.tool === "selection") {
        return;
      }

      throw new Error(
        "onMouseMove: node is not created. You should call onMouseDown first."
      );
    }

    switch (this.store.tool) {
      /*
       * Selection tool, update position of the current node.
       */
      case "selection": {
        _tempCtx.clearRect(0, 0, _tempCtx.canvas.width, _tempCtx.canvas.height);

        const point = this.getCanvasCoords(this.ctx, e);
        const updatedPoints = getUpdatedPoints(_node, point);

        _node.points = updatedPoints;

        drawNode(_tempCtx, _node, false);

        break;
      }
      /*
       * Other tools, update position of the current node.
       */
      default: {
        const point = this.getCanvasCoords(this.ctx, e);

        _tempCtx.clearRect(0, 0, _tempCtx.canvas.width, _tempCtx.canvas.height);

        _node.points[1] = [point.x, point.y];
        drawNode(_tempCtx, _node, false);
      }
    }
  }

  /**
   *
   * Mouse up event.
   * @param e - Mouse event.
   *
   */
  public onMouseUp(e: TCanvasMouseEvent) {
    if (!_node) {
      if (this.store.tool === "selection") {
        return;
      }
      throw new Error(
        "onMouseMove: node is not created. You should call onMouseDown first."
      );
    }

    switch (this.store.tool) {
      case "selection": {
        const newNodes = this.store.updateNode(_node);
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        drawNodes(this.ctx, newNodes);
        this.store.setSelectedNode(null);
        break;
      }
      default: {
        drawNode(this.ctx, _node);
        this.store.addNode(_node);
      }
    }

    this.clear();
  }

  /**
   *
   * Mouse leave event.
   * @param e - Mouse event.
   *
   */
  public onMouseLeave(e: TCanvasMouseEvent) {
    if (!_node) {
      if (this.store.tool === "selection") {
        return;
      }

      throw new Error(
        "onMouseMove: node is not created. You should call onMouseDown first."
      );
    }

    switch (this.store.tool) {
      case "selection": {
        this.store.setSelectedNode(null);
        break;
      }
      default: {
      }
    }

    this.clear();
  }

  /**
   *
   * Create a new node.
   * @param point - Point.
   * @returns CoreNode.
   *
   * Be aware that createNode should not be called when
   * selection tool is active.
   *
   */
  private createNode(point: Point): CoreNode {
    if (this.store.tool === "selection") {
      throw new Error("createNode: selection is not supported");
    }

    return {
      id: v4(),
      type: this.store.tool,
      points: [[point.x, point.y]],
      properties: this.properties,
    };
  }

  /**
   *
   * Copy a node.
   * @param node - Node.
   * @returns CoreNode.
   *
   * Should be called when selection tool is active.
   *
   */
  private copyNode(node: CoreNode) {
    return {
      ...node,
      properties: {
        ...node.properties,
      },
    };
  }

  /**
   *
   * Get canvas coordinates.
   * @param ctx - Canvas context (temp or main)
   * @param e - Mouse event.
   * @returns Point.
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

  /**
   *
   * Clear the temp canvas.
   *
   */
  private clear() {
    _tempCtx.clearRect(0, 0, _tempCtx.canvas.width, _tempCtx.canvas.height);
    _tempCtx.canvas.style.display = "none";
    _node = null;
    _tempCtx.restore();
  }

  /**
   *
   * Initialize the temp canvas properties.
   * @param node - Node.
   *
   */
  private initTempCtxProps(node: CoreNode) {
    if (!_node) {
      throw new Error("initTempCtx: node is not created");
    }

    _tempCtx.save();

    _tempCtx.canvas.width = this.ctx.canvas.width;
    _tempCtx.canvas.height = this.ctx.canvas.height;
    _tempCtx.canvas.style.display = "block";

    setCtxPropertiesFromNode(_tempCtx, node.properties);
  }
}

export {DrawingService};
