import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {EDIT_POSITION_REQUEST, type EditPositionResponse} from "./models";

const POST = createWithAuth(async (request: NextRequest, _ctx, _user) => {
  const body = await request.json();

  const {data, error} = EDIT_POSITION_REQUEST.safeParse(body);

  if (error) {
    return createErrorResponse(error).badRequest();
  }

  const supabase = await createClient();

  try {
    const {data: updatedData} = await supabase
      .from("saves")
      .update({
        title: data.title || null,
        tags: data.tags?.length ? data.tags : null,
      })
      .eq("id", data.id)
      .select()
      .single()
      .throwOnError();

    return createSuccessResponse<EditPositionResponse>({...updatedData});
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
