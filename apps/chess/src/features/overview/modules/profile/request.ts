import {registeredOnly} from "@/lib/protected";
import {UserService} from "@/services/supabase/api/server/user";

async function getProfileData() {
  const data = await UserService.getUserProfile();
  registeredOnly(data.isAnonymous);
  return data;
}

export {getProfileData};
