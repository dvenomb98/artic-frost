"use server";

import { handleFormErrors } from "@/lib/forms";
import { revalidateAllPaths } from "@/lib/cache";
import { FormState } from "@/lib/forms";
import { PROFILE_SCHEMA } from "@/services/supabase/models";
import { UserService } from "@/services/supabase/api/server/user";

async function updateProfileData(_: FormState, formData: FormData) {
  try {
    
    const data = PROFILE_SCHEMA.omit({ id: true }).parse({
      username: formData.get("username"),
      full_name: formData.get("full_name"),
      avatar_url: formData.get("avatar_url"),
    });

    await UserService.updateUserProfile(data);

    revalidateAllPaths();
    return {
      success: true,
      message: "Profile information was updated successfully!",
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { updateProfileData };
