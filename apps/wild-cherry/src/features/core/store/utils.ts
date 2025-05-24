function getCtx(node: HTMLCanvasElement) {
  const ctx = node.getContext("2d", {willReadFrequently: true})!;

  if (!ctx) {
    throw new Error("2d context is not supported in your browser.");
  }

  return ctx;
}

export {getCtx};
