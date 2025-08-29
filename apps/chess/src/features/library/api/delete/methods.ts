import {
  createErrorResponse,
  createSuccessResponse,
} from "@/services/route-handlers/response";
import {createClient} from "@/services/supabase/server";
import {NextResponse, type NextRequest} from "next/server";
import {createWithAuth} from "@/services/route-handlers/hoc/create-with-auth";

import {DELETE_SAVE_REQUEST, type DeleteSaveResponse} from "./models";

const DELETE = createWithAuth(async (request: NextRequest, _ctx, _user) => {
  const body = await request.json();

  const {data, error} = DELETE_SAVE_REQUEST.safeParse(body);

  if (error) {
    return createErrorResponse(error).badRequest();
  }

  const supabase = await createClient();

  try {
    await supabase.from("saves").delete().eq("id", data.id).throwOnError();

    return createSuccessResponse<DeleteSaveResponse>(null);
  } catch (error) {
    return createErrorResponse(error).internalServerError();
  }
});

export {DELETE};
