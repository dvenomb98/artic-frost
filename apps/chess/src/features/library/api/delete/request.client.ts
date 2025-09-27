import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {type DeleteSaveResponse} from "./models";

function deleteSave(id: number) {
  return api.delete<DeleteSaveResponse>({
    url: API_ROUTES.LIBRARY.DELETE_SAVE,
    data: {
      id,
    },
  });
}

export {deleteSave};
