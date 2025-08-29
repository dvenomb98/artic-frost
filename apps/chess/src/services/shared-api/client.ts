import {savePosition} from "./save-position/request.client";
import {createGame} from "./create-game/request.client";

const sharedApiClient = {
  savePosition,
  createGame,
};

export {sharedApiClient};
