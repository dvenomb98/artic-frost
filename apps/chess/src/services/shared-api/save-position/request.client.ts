import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {SavePositionRequest, type SavePositionResponse} from "./models";

function savePosition(data: SavePositionRequest) {
  return api.post<SavePositionResponse>({
    url: API_ROUTES.SHARED.SAVE_POSITION,
    data,
  });
}

export {savePosition};
