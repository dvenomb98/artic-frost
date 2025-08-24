import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {MakeMoveRequestBody} from "./models";

async function makeMove(id: string, data: MakeMoveRequestBody) {
  return api.post<void>({
    url: API_ROUTES.PLAY.MAKE_MOVE(id),
    data,
  });
}

export {makeMove};
