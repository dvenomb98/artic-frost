import "server-only";

import type {NextRequest, NextResponse} from "next/server";
import type {RouteHandlerError} from "@/services/route-handlers/models";
import {createErrorResponse} from "../response";
import {createClient} from "@/services/supabase/server";
import type {User} from "@supabase/supabase-js";

type AuthenticatedHandler<T = unknown> = (
  request: NextRequest,
  context: T,
  user: User
) => Promise<NextResponse | Response>;

export function createWithAuth<T = unknown>(handler: AuthenticatedHandler<T>) {
  return async (
    request: NextRequest,
    context: T
  ): Promise<NextResponse<RouteHandlerError> | NextResponse | Response> => {
    const supabase = await createClient();
    const {data: user, error: userError} = await supabase.auth.getUser();

    if (userError) {
      return createErrorResponse(userError).internalServerError();
    }

    return handler(request, context, user.user);
  };
}
