import {savePosition} from "./save-position/request.client";
import {createGame} from "./create-game/request.client";
import {editPosition} from "./edit-position/request.client";

const sharedApiClient = {
  savePosition,
  createGame,
  editPosition,
};

export {sharedApiClient};
