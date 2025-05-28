import {CoreNode} from "@/features/core/store/store";
import {detectRectangleCollision} from "../collisions";

describe("detectRectangleCollision", () => {
  const node: CoreNode = {
    id: "1",
    type: "rectangle",
    points: [
      [100, 100],
      [500, 500],
    ],
    properties: {} as CoreNode["properties"],
    highlight: false,
  };

  it("should return the correct hit type for a point inside the rectangle with threshold 0", () => {
    const point = {x: 100, y: 300};
    const result = detectRectangleCollision(point, node, 0);
    expect(result).toEqual({type: "edge", edge: "left"});
  });

  it("should return the correct hit type for a point inside the rectangle with threshold 0", () => {
    const point = {x: 101, y: 300};
    const result = detectRectangleCollision(point, node, 0);
    expect(result).toEqual({type: "inside"});
  });

  it("should return the correct hit type for a point inside the rectangle with threshold 10", () => {
    const point = {x: 110, y: 300};
    const result = detectRectangleCollision(point, node, 10);
    expect(result).toEqual({type: "edge", edge: "left"});
  });

  it("should return the correct hit type for a point outside the rectangle with threshold 10", () => {
    const point = {x: 510, y: 300};
    const result = detectRectangleCollision(point, node, 10);
    expect(result).toEqual({type: "edge", edge: "right"});
  });

  it("should return the null for a point outside the rectangle with threshold 20", () => {
    const point = {x: 79, y: 300};
    const result = detectRectangleCollision(point, node, 10);
    expect(result).toEqual(null);
  });
});
