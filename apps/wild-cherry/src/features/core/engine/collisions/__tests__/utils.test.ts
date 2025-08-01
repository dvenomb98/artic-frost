import {isPointInside} from "../utils";
import {getMinMaxPoints} from "@core/engine/math";
import {Point, MinMaxPoints} from "@core/engine/types";
import {NodePointTuple} from "@core/store/store";

describe("isPointInside", () => {
  const bounds: MinMaxPoints = {
    minX: 10,
    maxX: 50,
    minY: 20,
    maxY: 60,
  };

  it("should return true for point inside bounds", () => {
    const point: Point = {x: 30, y: 40};
    expect(isPointInside(point, bounds)).toBe(true);
  });

  it("should return false for point outside bounds with threshold 0", () => {
    const point: Point = {x: 5, y: 15};
    expect(isPointInside(point, bounds, 0)).toBe(false);
  });

  it("should return true for point on boundary", () => {
    const point: Point = {x: 10, y: 20};
    expect(isPointInside(point, bounds)).toBe(true);
  });

  it("should return true for point outside bounds with threshold", () => {
    const point: Point = {x: 5, y: 15};
    expect(isPointInside(point, bounds, 10)).toBe(true);
  });
});

describe("getMinMaxPoints", () => {
  const rectanglePoints: NodePointTuple = [
    [10, 20],
    [50, 60],
  ];
  const linePoints: NodePointTuple = [
    [10, 20],
    [50, 20],
  ];

  it("should return the correct min and max points for a rectangle", () => {
    const minMax = getMinMaxPoints(rectanglePoints);
    expect(minMax).toEqual({minX: 10, maxX: 50, minY: 20, maxY: 60});
  });

  it("should return the correct min and max points for a line", () => {
    const minMax = getMinMaxPoints(linePoints);
    expect(minMax).toEqual({minX: 10, maxX: 50, minY: 20, maxY: 20});
  });
});
