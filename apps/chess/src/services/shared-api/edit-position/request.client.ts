import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {type EditPositionResponse} from "./models";

function editPosition(id: number, title: string) {
  return api.post<EditPositionResponse>({
    url: API_ROUTES.SHARED.EDIT_POSITION,
    data: {
      id,
      title,
    },
  });
}

export {editPosition};
