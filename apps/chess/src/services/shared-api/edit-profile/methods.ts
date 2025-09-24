import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {EDIT_PROFILE_REQUEST, type EditProfileResponse} from "./models"

const POST = createWithAuth(async (request: NextRequest, _ctx, user) => {
  const body = await request.json();

  const {data, error} = EDIT_PROFILE_REQUEST.safeParse(body);

  if (error) {
    return createErrorResponse(error).badRequest();
  }

  const supabase = await createClient();

  try {
    const {data: updatedData} = await supabase
      .from("profiles")
      .update({
        nickname: data.nickname,
      })
      .eq("user_id", user.id)
      .select()
      .single()
      .throwOnError();

    return createSuccessResponse<EditProfileResponse>(updatedData);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
