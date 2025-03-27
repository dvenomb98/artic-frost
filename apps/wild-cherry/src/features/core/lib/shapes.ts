import {v4} from "uuid";
import {TempShape} from "../store/store";

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

const shape = new ShapeManager();

export {shape};
