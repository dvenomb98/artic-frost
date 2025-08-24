import {getMoves} from "./get-moves/request.client";
import {makeMove} from "./make-move/request.client";
import {createGame} from "./create-game/request.client";

const playClient = {
  getMoves,
  makeMove,
  createGame,
};

export {playClient};
