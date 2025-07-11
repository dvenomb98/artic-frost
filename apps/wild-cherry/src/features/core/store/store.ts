import {createStore} from "zustand/vanilla";
import {getCtx} from "./utils";
import {StoreApi} from "zustand";

import {getMinMaxPoints, isPointInside} from "@core/engine/collisions/utils";

import {Camera} from "@core/engine/types";
import {DEFAULT_CAMERA} from "@core/engine/const";

function createCoreStore() {
  return createStore<CoreStore>()((set, get) => ({
    ctx: null,
    nodes: [],
    tool: "rectangle",
    frame: null,
    camera: DEFAULT_CAMERA,
    isGridVisible: false,
    isCameraActive: false,
    textEditingState: {
      isEditing: false,
      nodeId: null,
    },
    /*
     *
     *
     */
    initialize: (node: HTMLCanvasElement) => {
      const ctx = getCtx(node);
      set({ctx});
    },
    /*
     *
     *
     */
    addNode: (node: CoreNode) => {
      const {nodes} = get();
      const newNodes = [...nodes, node];

      set({nodes: newNodes});

      return newNodes;
    },
    /*
     *
     *
     */
    updateNode: (node: CoreNode) => {
      const {nodes} = get();
      const targetNode = nodes.find(n => n.id === node.id);

      if (!targetNode) {
        throw new Error("updateNode: node not found");
      }

      const newNodes = nodes.map(n => (n.id === node.id ? node : n));

      set({nodes: newNodes});

      return newNodes;
    },
    /*
     *
     *
     */
    updateNodes: (nodes: CoreNode[]) => {
      const {nodes: currentNodes} = get();
      const newNodes = currentNodes.map(
        n => nodes.find(node => node.id === n.id) || n
      );
      set({nodes: newNodes});
    },
    /*
     *
     *
     */
    deleteNode: (id: string) => {
      const {nodes} = get();
      const newNodes = nodes.filter(n => n.id !== id);

      set({nodes: newNodes});

      return newNodes;
    },

    /*
     *
     *
     */
    deleteNodes: (nodes: CoreNode[]) => {
      const {nodes: currentNodes} = get();

      const nodeIdsToDelete = new Set(nodes.map(node => node.id));
      const newNodes = currentNodes.filter(
        node => !nodeIdsToDelete.has(node.id)
      );

      set({nodes: newNodes});

      return newNodes;
    },

    unhighlightAllNodes: () => {
      const {nodes} = get();
      let shouldUpdate = false;

      const newNodes = nodes.map(n => {
        if (n.highlight) {
          shouldUpdate = true;
        }
        return {...n, highlight: false};
      });

      if (shouldUpdate) {
        set({nodes: newNodes, frame: null});
      }

      return {nodes: newNodes, shouldUpdate};
    },
    /*
     *
     *
     */
    setTool: (tool: ToolType) => {
      set({tool});
    },
    /*
     *
     *
     */
    setFrame: (frame: CoreFrame | null) => {
      set({frame: frame});
    },
    /*
     *
     *
     */
    highlightNodesInFrame: (frame: CoreFrame) => {
      const {nodes} = get();

      if (!frame || !frame.points[1]) return false;

      const minMax = getMinMaxPoints(frame.points);

      let shouldUpdate = false;

      const updatedNodes = nodes.map(node => {
        const isInFrame = node.points.some(([x, y]) =>
          isPointInside({x, y}, minMax)
        );

        if (isInFrame) {
          shouldUpdate = true;
        }

        return {...node, highlight: isInFrame};
      });

      if (shouldUpdate) {
        set({nodes: updatedNodes});
      }

      return shouldUpdate;
    },
    /*
     *
     *
     */
    getHighlightedNodes: (nodes: CoreNode[]) => {
      return nodes.filter(node => node.highlight);
    },
    /*
     *
     *
     */
    setCamera: (camera: Camera) => {
      set({camera});
    },
    /*
     *
     *
     */
    setCameraScale: (scale: number) => {
      set({camera: {...get().camera, scale}});
    },
    /*
     *
     *
     */
    setIsGridVisible: (isGridVisible: boolean) => {
      set({isGridVisible});
    },
    /*
     *
     *
     */
    setIsCameraActive: (isCameraActive: boolean) => {
      set({isCameraActive});
    },
  }));
}

type NodePoint = [x: number, y: number];
type NodePointTuple = [NodePoint, ...NodePoint[]];

type CoreProperties = {
  fillStyle: string;
  strokeStyle: string;
  lineWidth: number;
  lineJoin: CanvasLineJoin;
  lineCap: CanvasLineCap;
  lineDash: [number, number];
  borderRadius: number;
};

type CoreTextProperties = {
  fontSize: number;
  fontFamily: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  color: string;
};

type CoreFrame = {
  id: string;
  points: NodePointTuple;
  highlight: boolean;
  properties: CoreProperties;
};

type CoreNode =
  | {
      id: string;
      type: "rectangle" | "line";
      points: NodePointTuple;
      highlight: boolean;
      properties: CoreProperties;
    }
  | {
      id: string;
      type: "text";
      rawText: string;
      textProperties: CoreTextProperties;
      points: NodePointTuple;
      highlight: boolean;
      properties: CoreProperties;
    };

type CoreState = {
  /**
   * Canvas context. Mutable.
   */
  ctx: CanvasRenderingContext2D | null;
  /**
   * Nodes that are used to render the canvas.
   */
  nodes: CoreNode[];
  /**
   * Current tool.
   */
  tool: ToolType;
  /**
   * Selection frame that select multiple nodes.
   */
  frame: CoreFrame | null;
  /**
   * Zoom level.
   */
  camera: Camera;
  /**
   * Is Grid Visible on canvas.
   */
  isGridVisible: boolean;
  /**
   * Is Interaction Active.
   */
  isCameraActive: boolean;
};

type ToolType = CoreNode["type"] | "pointer" | "frame";

type CoreActions = {
  /**
   * Initialize the canvas. Should be called once during first render.
   * @param node - The canvas HTML element.
   */
  initialize: (node: HTMLCanvasElement) => void;

  /**
   * Add a new node to the canvas.
   * @param node - The node to add.
   * @returns The new nodes.
   */
  addNode: (node: CoreNode) => CoreNode[];

  /**
   * Update a node.
   * @param node - The node to update.
   * @returns The updated nodes.
   */
  updateNode: (node: CoreNode) => CoreNode[];

  /**
   * Update multiple nodes.
   * @param nodes - The nodes to update.
   * @returns The updated nodes.
   */
  updateNodes: (nodes: CoreNode[]) => void;

  /**
   * Delete a node.
   * @param id - The id of the node to delete.
   * @returns The new nodes.
   */
  deleteNode: (id: string) => CoreNode[];

  /**
   * Delete a node.
   * @param id - The id of the node to delete.
   * @returns The new nodes.
   */
  deleteNodes: (nodes: CoreNode[]) => CoreNode[];

  /**
   * Set the current tool.
   * @param tool - The tool to set.
   */
  setTool: (tool: ToolType) => void;

  /**
   * Unhighlight all nodes.
   */
  unhighlightAllNodes: () => {
    nodes: CoreNode[];
    shouldUpdate: boolean;
  };
  /**
   * Set the selection frame.
   */
  setFrame: (frame: CoreFrame | null) => void;
  /**
   * Highlight nodes in the selection frame.
   * @param frame - The selection frame.
   */
  highlightNodesInFrame: (frame: CoreFrame) => boolean;

  /**
   * Get highlighted nodes.
   * @returns The highlighted nodes.
   */
  getHighlightedNodes: (nodes: CoreNode[]) => CoreNode[];
  /**
   * Set the zoom level.
   * @param zoom - The zoom level.
   */
  setCamera: (camera: Camera) => void;
  /**
   * Set the zoom level.
   * @param scale - The zoom level.
   */
  setCameraScale: (scale: number) => void;
  /**
   * Set the grid visibility.
   * @param isGridVisible - The grid visibility.
   */
  setIsGridVisible: (isGridVisible: boolean) => void;
  /**
   * Set the interaction active.
   * @param isInteractionActive - The interaction active.
   */
  setIsCameraActive: (isCameraActive: boolean) => void;
};

type CoreStore = CoreState & CoreActions;
type CoreStoreInstance = StoreApi<CoreStore>;

export {
  createCoreStore,
  type CoreStore,
  type CoreNode,
  type ToolType,
  type CoreStoreInstance,
  type NodePointTuple,
  type CoreFrame,
  type CoreProperties,
  type CoreTextProperties,
};
