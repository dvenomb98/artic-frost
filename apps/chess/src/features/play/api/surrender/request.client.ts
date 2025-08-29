import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {type SurrenderResponse} from "./models";

function surrender(id: string) {
  return api.post<SurrenderResponse>({
    url: API_ROUTES.PLAY.SURRENDER(id),
  });
}

export {surrender};
