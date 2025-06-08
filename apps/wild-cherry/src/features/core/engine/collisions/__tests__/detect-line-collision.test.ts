import {CoreNode} from "@/features/core/store/store";
import {detectLineCollision} from "../collisions";

describe("detectLineCollision", () => {
  const node: CoreNode = {
    id: "1",
    type: "line",
    points: [
      [100, 100],
      [200, 200],
    ],
    properties: {} as CoreNode["properties"],
    highlight: false,
  };

  it("should return null if the point is not on the line with threshold 0", () => {
    const point = {x: 40, y: 50};
    const result = detectLineCollision(point, node, 0);
    expect(result).toBeNull();
  });
});
