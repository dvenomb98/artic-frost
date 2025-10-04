import "server-only";

import type {NextRequest, NextResponse} from "next/server";
import type {RouteHandlerError} from "@/services/route-handlers/models";
import {createErrorResponse} from "../response";
import {getUserId} from "@/services/supabase/server";

type AuthenticatedHandler<T = unknown> = (
  request: NextRequest,
  context: T,
  userId: string
) => Promise<NextResponse | Response>;

export function createWithAuth<T = unknown>(handler: AuthenticatedHandler<T>) {
  return async (
    request: NextRequest,
    context: T
  ): Promise<NextResponse<RouteHandlerError> | NextResponse | Response> => {
    try {
      const userId = await getUserId();
      return handler(request, context, userId);
    } catch (error) {
      return createErrorResponse(error).internalServerError();
    }
  };
}
