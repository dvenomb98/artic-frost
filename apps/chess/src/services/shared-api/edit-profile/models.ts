import {DbProfileTableRow} from "@/services/supabase/types";
import {z} from "zod/v4";

const EDIT_PROFILE_REQUEST = z.object({
  nickname: z.string().max(16, "Nickname must be less than 16 characters"),
});

type EditProfileResponse = DbProfileTableRow;
type EditProfileRequest = z.infer<typeof EDIT_PROFILE_REQUEST>;

export {
  type EditProfileResponse,
  type EditProfileRequest,
  EDIT_PROFILE_REQUEST,
};
