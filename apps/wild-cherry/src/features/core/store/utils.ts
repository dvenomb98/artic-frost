function getCtx(node: HTMLCanvasElement) {
  const ctx = node.getContext("2d", {willReadFrequently: true})!;

  if (!ctx) {
    throw new Error("2d context is not supported in your browser.");
  }

  return ctx;
}

function getCssColor(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name);
}

function getCanvasTheme() {
  return {
    fillStyle: getCssColor("--canvas-fill"),
    strokeStyle: getCssColor("--canvas-stroke"),
  };
}

export {getCtx, getCssColor, getCanvasTheme};
