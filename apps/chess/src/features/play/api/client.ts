import {getMoves} from "./get-moves/request.client";
import {makeMove} from "./make-move/request.client";
import {createGame} from "./create-game/request.client";
import {surrender} from "./surrender/request.client";

const playClient = {
  getMoves,
  makeMove,
  createGame,
  surrender,
};

export {playClient};
