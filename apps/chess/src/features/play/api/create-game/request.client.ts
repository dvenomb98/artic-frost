import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";

async function createGame() {
  return api.post<void>({
    url: API_ROUTES.PLAY.CREATE_GAME,
  });
}

export {createGame};
