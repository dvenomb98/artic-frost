import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {CreateGameRequest, CreateGameResponse} from "./models";

function createGame(data: CreateGameRequest) {
  return api.post<CreateGameResponse>({
    url: API_ROUTES.PLAY.CREATE_GAME,
    data,
  });
}

export {createGame};
