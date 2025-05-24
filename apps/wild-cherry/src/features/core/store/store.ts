import {createStore} from "zustand/vanilla";
import {getCtx, getCanvasTheme} from "./utils";
import {StoreApi} from "zustand";

function createCoreStore() {
  return createStore<CoreStore>()((set, get) => ({
    ctx: null,
    nodes: [],
    selectedNode: null,
    tool: "rectangle",
    /*
     *
     *
     */
    initialize: (node: HTMLCanvasElement) => {
      const ctx = getCtx(node);

      const theme = getCanvasTheme();

      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
      ctx.fillStyle = theme.fillStyle;
      ctx.strokeStyle = theme.strokeStyle;

      set({ctx});

      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
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
    /*
     *
     *
     */
    setSelectedNode: (id: CoreNode["id"] | null) => {
      set({selectedNode: id});
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
  /**
   * Points of the node relative to the canvas.
   * [x, y]
   */
  points: number[][];
  type: "line" | "rectangle";
  properties: {
    fillStyle: string;
    strokeStyle: string;
    lineWidth: number;
    lineCap: CanvasLineCap;
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
   * Selected node.
   */
  selectedNode: CoreNode["id"] | null;
  /**
   * Current tool.
   */
  tool: ToolType;
};

type ToolType = CoreNode["type"] | "selection";

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
   * Set the selected node.
   * @param id - The id of the node to select.
   */
  setSelectedNode: (id: CoreNode["id"] | null) => void;

  /**
   * Set the current tool.
   * @param tool - The tool to set.
   */
  setTool: (tool: ToolType) => void;
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
