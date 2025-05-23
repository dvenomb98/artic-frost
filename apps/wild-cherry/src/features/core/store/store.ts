import {createStore} from "zustand/vanilla";
import {getCtx, getCanvasTheme} from "./utils";

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
      set(state => ({nodes: [...state.nodes, node]}));
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

      const newNode = {
        ...targetNode,
        ...node,
        properties: {
          ...targetNode.properties,
          ...node.properties,
        },
      };

      set(state => ({
        nodes: state.nodes.map(n => (n.id === node.id ? newNode : n)),
      }));
    },
    /*
     *
     *
     */
    deleteNode: (id: string) => {
      set(state => ({
        nodes: state.nodes.filter(n => n.id !== id),
      }));
    },
    /*
     *
     *
     */
    setSelectedNode: (node: CoreNode) => {
      set({selectedNode: node});
    },
    /*
     *
     *
     */
    setTool: (tool: CoreNode["type"]) => {
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
  selectedNode: CoreNode | null;
  /**
   * Current tool.
   */
  tool: CoreNode["type"];
};

type CoreActions = {
  /**
   * Initialize the canvas. Should be called once during first render.
   * @param node - The canvas HTML element.
   */
  initialize: (node: HTMLCanvasElement) => void;

  /**
   * Add a new node to the canvas.
   * @param node - The node to add.
   */
  addNode: (node: CoreNode) => void;

  /**
   * Update a node.
   * @param node - The node to update.
   */
  updateNode: (node: CoreNode) => void;

  /**
   * Delete a node.
   * @param id - The id of the node to delete.
   */
  deleteNode: (id: string) => void;

  /**
   * Set the selected node.
   * @param node - The node to select.
   */
  setSelectedNode: (node: CoreNode) => void;

  /**
   * Set the current tool.
   * @param tool - The tool to set.
   */
  setTool: (tool: CoreNode["type"]) => void;
};

type CoreStore = CoreState & CoreActions;

export {createCoreStore, type CoreStore, type CoreNode};
