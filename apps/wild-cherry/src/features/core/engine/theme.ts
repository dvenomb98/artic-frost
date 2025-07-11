import type {
  CoreNode,
  CoreProperties,
  CoreTextProperties,
} from "@core/store/store";
import {Camera} from "./types";

const CANVAS_CSS_PROPERTIES = {
  FILL_STYLE: "--canvas-fill",
  STROKE_STYLE: "--canvas-stroke",
  HIGHLIGHT: "--canvas-highlight",
  FRAME_STROKE: "--canvas-frame-stroke",
  FRAME_FILL: "--canvas-frame-fill",
  GRID_STROKE: "--canvas-grid-stroke",
  TEXT_NODE_STROKE: "--canvas-text-node-stroke",
} as const;

const HIGHLIGHT_OFFSET = 8;
const GRID_SIZE = 50;
const BORDER_RADIUS = 8;

function getCssColor(
  name: (typeof CANVAS_CSS_PROPERTIES)[keyof typeof CANVAS_CSS_PROPERTIES]
) {
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
    case "text": {
      return {
        fillStyle: theme.fillStyle,
        strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.TEXT_NODE_STROKE),
        lineWidth: 1,
        lineCap: "round",
        lineJoin: "round",
        borderRadius: 0,
        lineDash: [0, 0],
      };
    }
    default: {
      return {
        ...theme,
        lineWidth: 2,
        lineCap: "round",
        lineJoin: "round",
        borderRadius: BORDER_RADIUS,
        lineDash: [0, 0],
      };
    }
  }
}

function generateTextProperties(): CoreTextProperties {
  const theme = getCanvasTheme();

  return {
    color: theme.strokeStyle,
    fontSize: 16,
    fontFamily: "Arial",
    textAlign: "left",
    textBaseline: "middle",
  };
}

function generateFrameProperties(): CoreProperties {
  return {
    lineWidth: 2,
    lineCap: "round",
    lineJoin: "round",
    borderRadius: BORDER_RADIUS,
    strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.FRAME_STROKE),
    fillStyle: getCssColor(CANVAS_CSS_PROPERTIES.FRAME_FILL),
    lineDash: [10, 10],
  };
}

function generateGridProperties(
  camera: Camera
): Omit<CoreProperties, "borderRadius"> {
  return {
    lineDash: [0, 0],
    lineJoin: "bevel",
    lineCap: "square",
    fillStyle: "transparent",
    strokeStyle: getCssColor(CANVAS_CSS_PROPERTIES.GRID_STROKE),
    lineWidth: 1 / camera.scale,
  };
}

export {
  getCssColor,
  getCanvasTheme,
  generateNodeProperties,
  generateTextProperties,
  generateFrameProperties,
  generateGridProperties,
  CANVAS_CSS_PROPERTIES,
  HIGHLIGHT_OFFSET,
  BORDER_RADIUS,
  GRID_SIZE,
};
