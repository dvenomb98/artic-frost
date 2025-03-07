type Point = {
  x: number;
  y: number;
};

type ExtractedLineCap = Extract<CanvasLineCap, "round" | "square">;
type ShapeOption = "stroke_and_transparent" | "stroke_and_fill" | "fill_only";

export {type Point, type ExtractedLineCap, type ShapeOption};
