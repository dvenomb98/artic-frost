import type {CoreNode, CoreProperties} from "@core/store/store";
import {Camera} from "./types";

const CANVAS_CSS_PROPERTIES = {
  FILL_STYLE: "--canvas-fill",
  STROKE_STYLE: "--canvas-stroke",
  HIGHLIGHT: "--canvas-highlight",
  FRAME_STROKE: "--canvas-frame-stroke",
  FRAME_FILL: "--canvas-frame-fill",
  GRID_STROKE: "--canvas-grid-stroke",
} as const;

const HIGHLIGHT_OFFSET = 8;
const GRID_SIZE = 50;
const BORDER_RADIUS = 8;

const DEFAULT_NODE_PROPERTIES: Omit<CoreProperties, "strokeStyle"> = {
  lineWidth: 2,
  lineCap: "round",
  lineJoin: "round",
  borderRadius: BORDER_RADIUS,
  fillStyle: "transparent",
  lineDash: [0, 0],
};

const DEFAULT_GRID_PROPERTIES: Omit<
  CoreProperties,
  "borderRadius" | "strokeStyle"
> = {
  lineWidth: 1,
  lineDash: [0, 0],
  lineJoin: "bevel",
  lineCap: "square",
  fillStyle: "transparent",
};

function getCssColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function getCanvasTheme() {
  return {
    fillStyle: getCssColor(CANVAS_CSS_PROPERTIES.FILL_STYLE),
    strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.STROKE_STYLE),
  };
}

function generateNodeProperties(type: CoreNode["type"]): CoreProperties {
  const theme = getCanvasTheme();

  switch (type) {
    case "line":
      return {
        ...theme,
        ...DEFAULT_NODE_PROPERTIES,
      };
    case "rectangle":
      return {
        ...theme,
        ...DEFAULT_NODE_PROPERTIES,
      };
    default:
      return {
        ...theme,
        ...DEFAULT_NODE_PROPERTIES,
      };
  }
}

function generateFrameProperties(): CoreProperties {
  return {
    ...DEFAULT_NODE_PROPERTIES,
    strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.FRAME_STROKE),
    fillStyle: getCssColor(CANVAS_CSS_PROPERTIES.FRAME_FILL),
    lineDash: [10, 10],
  };
}

function generateGridProperties(
  camera: Camera
): Omit<CoreProperties, "borderRadius"> {
  return {
    ...DEFAULT_GRID_PROPERTIES,
    strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.GRID_STROKE),
    lineWidth: 1 / camera.scale,
  };
}

function setHighlightProperties(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = getCssColor(CANVAS_CSS_PROPERTIES.HIGHLIGHT);
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
}

export {
  getCanvasTheme,
  generateNodeProperties,
  setHighlightProperties,
  generateFrameProperties,
  generateGridProperties,
  HIGHLIGHT_OFFSET,
  BORDER_RADIUS,
  GRID_SIZE,
};
