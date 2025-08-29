import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {GetMovesResponse, type GetMovesRequestBody} from "./models";

function getMoves(id: string, data: GetMovesRequestBody) {
  return api.post<GetMovesResponse>({
    url: API_ROUTES.PLAY.GET_MOVES(id),
    data,
  });
}

export {getMoves};
