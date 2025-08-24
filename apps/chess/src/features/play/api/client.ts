import {getMoves} from "./get-moves/request.client";
import {makeMove} from "./make-move/request.client";

const playClient = {
  getMoves,
  makeMove,
};

export {playClient};
