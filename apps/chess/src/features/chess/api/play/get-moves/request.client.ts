import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import type {Moves} from "wasm-chess";
import {type GetMovesRequestBody} from "./models";

async function getMoves(id: string, data: GetMovesRequestBody) {
  return api.post<Moves>({
    url: API_ROUTES.PLAY.GET_MOVES(id),
    data: {
      row: data.row,
      col: data.col,
    },
  });
}

export {getMoves};
