import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {type SavePositionResponse} from "./models";

function savePosition(fen: string) {
  return api.post<SavePositionResponse>({
    url: API_ROUTES.SHARED.SAVE_POSITION,
    data: {
      fen,
    },
  });
}

export {savePosition};
