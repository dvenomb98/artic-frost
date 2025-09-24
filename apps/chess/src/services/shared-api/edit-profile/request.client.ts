import {api} from "@/services/route-handlers/request.client";
import {API_ROUTES} from "@/services/route-handlers/routes";
import {EditProfileRequest, EditProfileResponse} from "./models";

function editProfile(data: EditProfileRequest) {
  return api.post<EditProfileResponse>({
    url: API_ROUTES.SHARED.EDIT_PROFILE,
    data,
  });
}

export {editProfile};
