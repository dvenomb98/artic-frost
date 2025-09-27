import {getMoves} from "./get-moves/request.client";
import {makeMove} from "./make-move/request.client";
import {surrender} from "./surrender/request.client";

const playClient = {
  getMoves,
  makeMove,
  surrender,
};

export {playClient};
