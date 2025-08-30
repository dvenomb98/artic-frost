import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {NextResponse, type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {EDIT_POSITION_REQUEST, type EditPositionResponse} from "./models";

const POST = createWithAuth(async (request: NextRequest, _ctx, user) => {
  const body = await request.json();

  const {data, error} = EDIT_POSITION_REQUEST.safeParse(body);

  if (error) {
    return createErrorResponse(error).badRequest();
  }

  const supabase = await createClient();

  try {
    await supabase
      .from("saves")
      .update({
        title: data.title,
      })
      .eq("id", data.id)
      .throwOnError();

    return createSuccessResponse<EditPositionResponse>(null);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
