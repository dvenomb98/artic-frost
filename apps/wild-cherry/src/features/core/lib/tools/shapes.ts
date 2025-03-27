import {v4} from "uuid";
import {Shape, TempShape} from "../../store/store";

class ShapeManager {
  #shape: TempShape | null = null;

  create(args: Pick<TempShape, "points">) {
    const id = v4();
    this.#shape = {
      id,
      points: args.points,
    };
  }

  get() {
    if (!this.#shape)
      throw new Error("You probably forgot to call createShape first");
    return this.#shape;
  }

  clear() {
    this.#shape = null;
  }

  addPoint(point: number[]) {
    if (!this.#shape) {
      throw new Error("You probably forgot to call createShape first");
    }

    this.#shape.points.push(point);
  }
}

class SelectedShapeManager {
  #shape: Shape | null = null;

  get() {
    return this.#shape;
  }

  create(shape: Shape) {
    this.#shape = shape;
  }

  clear() {
    this.#shape = null;
  }
}

const selectedShapeManager = new SelectedShapeManager();
const shapeManager = new ShapeManager();

export {shapeManager, selectedShapeManager};
