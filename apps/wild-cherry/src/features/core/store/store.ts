import {createStore} from "zustand/vanilla";
import {ToolId, TOOLS} from "../lib/tools";
import {
  getCanvasState,
  getCtx,
  restoreCanvasState,
  copyCanvas,
  truncateShapes,
  getCssColor,
} from "../lib/utils";
import {ShapeOption} from "../lib/types";
import {redrawCanvasFromShapes} from "../lib/draw";
import {CHERRY_STORAGE_SCHEMA} from "./persist";
import {z} from "zod";
import {v4} from "uuid";

// _ stands for extended properties
declare global {
  interface CanvasRenderingContext2D {
    _ext_shapeOption: ShapeOption;
  }
}

type CanvasContextProps = {
  transform: DOMMatrix;
  fillStyle: string | CanvasGradient | CanvasPattern;
  strokeStyle: string | CanvasGradient | CanvasPattern;
  lineWidth: number;
  lineCap: CanvasLineCap;
  lineJoin: CanvasLineJoin;
  miterLimit: number;
  lineDashOffset: number;
  shadowBlur: number;
  shadowColor: string;
  shadowOffsetX: number;
  shadowOffsetY: number;
  globalAlpha: number;
  globalCompositeOperation: GlobalCompositeOperation;
  font: string;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  direction: CanvasDirection;
  imageSmoothingEnabled: boolean;
  imageSmoothingQuality: ImageSmoothingQuality;
  lineDash: number[];
  contextAttributes?: CanvasRenderingContext2DSettings;
  _ext_shapeOption: ShapeOption;
};

type ShapeProperties = Pick<
  CanvasContextProps,
  "strokeStyle" | "fillStyle" | "lineWidth" | "_ext_shapeOption" | "lineCap"
>;

type Shape = {
  id: string;
  points: number[][];
  type: ToolId;
  properties: ShapeProperties;
};

type TempShape = Omit<Shape, "properties" | "id"> & {
  properties?: Partial<CanvasContextProps>;
  id?: string;
};

type CherryState = {
  ctx: CanvasRenderingContext2D | null;
  currentHistoryIdx: number;
  currentShapeId: string | null;
  shapes: Shape[];
  toolId: ToolId;
  height: number;
  width: number;
  properties: CanvasContextProps;
};

type CherryActions = {
  setToolId: (tool_id: ToolId) => void;
  resetState: () => void;
  setCanvasInitProperties: (canvas: HTMLCanvasElement) => void;
  setDataFromPersist: (data: z.infer<typeof CHERRY_STORAGE_SCHEMA>) => void;
  setProperty: <T extends keyof CanvasContextProps>(
    property: T,
    value: CanvasContextProps[T]
  ) => void;
  setCanvasPropertiesAndState: (
    ctx: CanvasRenderingContext2D,
    state: CanvasContextProps
  ) => void;
  restoreFromShapes: (inc: 1 | -1) => Promise<void>;
  addShape: (s: TempShape) => Shape[];
  updateShape: (
    id: string,
    points?: number[][],
    properties?: Partial<Shape["properties"]>,
    type?: Shape["type"]
  ) => Shape[];
};

type CherryStore = CherryState & CherryActions;

const DEFAULT_STATE: CherryState = {
  ctx: null,
  currentShapeId: null,
  shapes: [],
  currentHistoryIdx: 0,
  toolId: TOOLS.FREE_HAND.id,
  height: 800,
  width: 800,
  properties: {
    // todo
    transform:
      typeof window === "undefined"
        ? ({} as DOMMatrix)
        : new window.DOMMatrix(),
    fillStyle: "#000000",
    strokeStyle: "#ffffff",
    lineWidth: 2,
    lineCap: "round",
    lineJoin: "miter",
    miterLimit: 10,
    lineDashOffset: 0,
    shadowBlur: 0,
    shadowColor: "#000000",
    shadowOffsetX: 0,
    shadowOffsetY: 0,
    globalAlpha: 1,
    globalCompositeOperation: "source-over",
    font: "10px sans-serif",
    textAlign: "start",
    textBaseline: "alphabetic",
    direction: "inherit",
    imageSmoothingEnabled: true,
    imageSmoothingQuality: "low",
    lineDash: [],
    _ext_shapeOption: "stroke_and_fill",
  },
};

// allow init with partial state
type PartialInitState = Omit<Partial<CherryState>, "properties"> & {
  properties?: Partial<CanvasContextProps>;
};

const createCherryStore = (initState?: PartialInitState) => {
  const defaultState = {
    ...DEFAULT_STATE,
    ...initState,
    properties: {
      ...DEFAULT_STATE.properties,
      ...initState?.properties,
    },
  };
  return createStore<CherryStore>()((set, get) => ({
    ...defaultState,
    /*
     *
     *
     * Canvas state
     *
     */
    setCanvasInitProperties: canvas => {
      const {width, height, properties, setCanvasPropertiesAndState} = get();

      const w = window.innerWidth || width;
      const h = window.innerHeight || height;

      const fill = getCssColor("--canvas-fill");
      const stroke = getCssColor("--canvas-stroke");

      canvas.width = w;
      canvas.height = h;

      const ctx = getCtx(canvas, {
        willReadFrequently: true,
      });

      set({ctx});

      setCanvasPropertiesAndState(ctx, {
        ...properties,
        fillStyle: fill,
        strokeStyle: stroke,
      });

      ctx.fillRect(0, 0, w, h);
    },
    setCanvasPropertiesAndState: (
      ctx: CanvasRenderingContext2D,
      properties: CanvasContextProps
    ) => {
      const {setProperty} = get();

      const state = getCanvasState(ctx);
      restoreCanvasState(ctx, {
        ...state,
        ...properties,
      });

      (Object.keys(properties) as Array<keyof typeof properties>).forEach(
        key => {
          setProperty(key, properties[key]);
        }
      );
    },
    setDataFromPersist: data => {
      const {ctx, setCanvasPropertiesAndState} = get();
      if (!ctx) return;

      const state = getCanvasState(ctx);
      setCanvasPropertiesAndState(ctx, {
        ...state,
        ...data.properties,
      });

      const redrawTruncatedShapes = truncateShapes(
        data.shapes,
        data.currentHistoryIdx
      );

      redrawCanvasFromShapes(ctx, redrawTruncatedShapes);

      set({...data});
    },
    resetState: () => {
      const {ctx, setCanvasPropertiesAndState} = get();

      if (!ctx) return;

      ctx.canvas.width = DEFAULT_STATE.width;
      ctx.canvas.height = DEFAULT_STATE.height;

      setCanvasPropertiesAndState(ctx, DEFAULT_STATE.properties);

      ctx.fillRect(0, 0, DEFAULT_STATE.width, DEFAULT_STATE.height);
      set({...DEFAULT_STATE, ctx: ctx});
    },

    setToolId: toolId => {
      set({toolId});
    },

    setProperty: <T extends keyof CanvasContextProps>(
      property: T,
      value: CanvasContextProps[T]
    ) => {
      const {ctx, properties} = get();
      if (!ctx) return;

      switch (property) {
        case "lineDash":
          ctx.setLineDash(value as number[]);
          break;
        case "transform":
          ctx.setTransform(value as DOMMatrix);
          break;
        // @ts-ignore @eslint-disable-next-line @typescript-eslint/ban-ts-comment
        case "contextAttributes":
          //  can't be changed after context creation
          return;
        default:
          (ctx[property as keyof CanvasRenderingContext2D] as any) = value;
      }

      set({
        properties: {
          ...properties,
          [property]: value,
        },
      });
    },
    /*
     *
     *
     * Shapes
     *
     *
     */
    restoreFromShapes: async inc => {
      const {ctx, currentHistoryIdx, shapes} = get();
      if (!ctx) return;

      const newHistoryIdx = Math.max(
        0,
        Math.min(shapes.length, currentHistoryIdx + inc)
      );

      const activeShapes = truncateShapes(shapes, newHistoryIdx);
      redrawCanvasFromShapes(ctx, activeShapes);

      set({currentHistoryIdx: newHistoryIdx});
    },
    addShape: s => {
      const {properties, shapes, currentHistoryIdx} = get();
      const id = v4();

      const truncatedShapes = truncateShapes(shapes, currentHistoryIdx);

      const newShape: Shape = {
        ...s,
        id,
        properties: {
          lineWidth: properties.lineWidth,
          fillStyle: properties.fillStyle,
          strokeStyle: properties.strokeStyle,
          _ext_shapeOption: properties._ext_shapeOption,
          lineCap: properties.lineCap,
        },
      };

      const newShapes = [...truncatedShapes, newShape];
      set({
        shapes: newShapes,
        currentHistoryIdx: newShapes.length,
        currentShapeId: id,
      });
      return newShapes;
    },
    updateShape: (id, points, properties) => {
      const {shapes, currentHistoryIdx} = get();
      const targetShape = shapes.find(shape => shape.id === id);

      if (!targetShape) {
        throw new Error("Shape not found at updateShape");
      }

      const newShape = {
        ...targetShape,
        points: points || targetShape.points,
        properties: {
          ...targetShape.properties,
          ...properties,
        },
      };

      const newShapes = truncateShapes(
        shapes.map(shape => (shape.id === id ? newShape : shape)),
        currentHistoryIdx
      );

      set({shapes: newShapes, currentShapeId: id});
      return newShapes;
    },
  }));
};

export {
  type Shape,
  type TempShape,
  type CherryState,
  type CherryStore,
  type CanvasContextProps,
  type ShapeProperties,
  createCherryStore,
};
