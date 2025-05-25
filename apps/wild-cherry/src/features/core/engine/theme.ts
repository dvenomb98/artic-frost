import {CoreNode} from "../store/store";

const CANVAS_CSS_PROPERTIES = {
  FILL_STYLE: "--canvas-fill",
  STROKE_STYLE: "--canvas-stroke",
  HIGHLIGHT: "--canvas-highlight",
  MULTISELECTION_FRAME: "--canvas-multiselection-frame",
} as const;

const HIGHLIGHT_OFFSET = 8;

const DEFAULT_NODE_PROPERTIES: Omit<CoreNode["properties"], "strokeStyle"> = {
  lineWidth: 2,
  lineCap: "round",
  lineJoin: "round",
  borderRadius: 8,
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

function generateNodeProperties(
  type: CoreNode["type"]
): CoreNode["properties"] {
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

function setHighlightProperties(ctx: CanvasRenderingContext2D) {
  ctx.strokeStyle = getCssColor(CANVAS_CSS_PROPERTIES.HIGHLIGHT);
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);
}

export {
  getCanvasTheme,
  generateNodeProperties,
  setHighlightProperties,
  HIGHLIGHT_OFFSET,
};
