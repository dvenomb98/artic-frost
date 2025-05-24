import {createStore} from "zustand/vanilla";
import {getCtx} from "./utils";
import {StoreApi} from "zustand";

function createCoreStore() {
  return createStore<CoreStore>()((set, get) => ({
    ctx: null,
    nodes: [],
    tool: "rectangle",
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

      const newNode = structuredClone({...targetNode, ...node});

      const newNodes = nodes.map(n => (n.id === node.id ? newNode : n));

      set({nodes: newNodes});

      return newNodes;
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
        set({nodes: newNodes});
      }

      return newNodes;
    },
    /*
     *
     *
     */
    setTool: (tool: ToolType) => {
      set({tool});
    },
  }));
}

type CoreNode = {
  id: string;
  type: "rectangle" | "line";
  /**
   * Points of the node relative to the canvas.
   * [x, y]
   */
  points: [x: number, y: number][];
  highlight: boolean;
  properties: {
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    lineJoin: CanvasLineJoin;
    lineCap: CanvasLineCap;
    borderRadius: number;
    shapeOption: "fill_only" | "fill_and_stroke" | "stroke_and_transparent";
  };
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
};

type ToolType = CoreNode["type"] | "selection" | "multiselection";

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
   * Delete a node.
   * @param id - The id of the node to delete.
   * @returns The new nodes.
   */
  deleteNode: (id: string) => CoreNode[];

  /**
   * Set the current tool.
   * @param tool - The tool to set.
   */
  setTool: (tool: ToolType) => void;

  /**
   * Unhighlight all nodes.
   */
  unhighlightAllNodes: () => CoreNode[];
};

type CoreStore = CoreState & CoreActions;
type CoreStoreInstance = StoreApi<CoreStore>;

export {
  createCoreStore,
  type CoreStore,
  type CoreNode,
  type ToolType,
  type CoreStoreInstance,
};
