import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {EditPositionRequest, type EditPositionResponse} from "./models";

function editPosition(data: EditPositionRequest) {
  return api.post<EditPositionResponse>({
    url: API_ROUTES.SHARED.EDIT_POSITION,
    data,
  });
}

export {editPosition};
