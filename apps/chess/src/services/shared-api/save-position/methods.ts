import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {NextResponse, type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {SAVE_POSITION_REQUEST, type SavePositionResponse} from "./models";

const POST = createWithAuth(async (request: NextRequest, _ctx, user) => {
  const body = await request.json();

  const {data, error} = SAVE_POSITION_REQUEST.safeParse(body);

  if (error) {
    return createErrorResponse(error).badRequest();
  }

  const supabase = await createClient();

  try {
    await supabase
      .from("saves")
      .insert({
        fen: data.fen,
        user_id: user.id,
      })
      .throwOnError();

    return createSuccessResponse<SavePositionResponse>(null);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {POST};
