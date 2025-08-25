import "server-only";

import {NextResponse} from "next/server";
import {
  ERROR_CODES,
  RouteHandlerError,
  SUCCESS_CODES,
  type RouteHandlerSuccess,
} from "./models";
import {z, ZodError} from "zod/v4";
import {isAuthApiError} from "@supabase/supabase-js";

function createSuccessResponse<T = unknown>(
  data: T
): NextResponse<RouteHandlerSuccess<T>> {
  return NextResponse.json({data, ok: true}, {status: SUCCESS_CODES.OK});
}

function createErrorResponse(error: unknown): {
  badRequest: () => NextResponse<RouteHandlerError>;
  notFound: () => NextResponse<RouteHandlerError>;
  internalServerError: () => NextResponse<RouteHandlerError>;
} {
  return {
    badRequest: () => createErrorResponseInner(error, ERROR_CODES.BAD_REQUEST),
    notFound: () => createErrorResponseInner(error, ERROR_CODES.NOT_FOUND),
    internalServerError: () =>
      createErrorResponseInner(error, ERROR_CODES.INTERNAL_SERVER_ERROR),
  };
}

function createErrorResponseInner(
  error: unknown,
  status: number
): NextResponse<RouteHandlerError> {
  if (error instanceof ZodError) {
    const formattedError = z.prettifyError(error);
    return NextResponse.json({error: formattedError, ok: false}, {status});
  }

  if (error instanceof Error || isAuthApiError(error)) {
    return NextResponse.json({error: error.message, ok: false}, {status});
  }

  if (typeof error === "string") {
    return NextResponse.json({error, ok: false}, {status});
  }

  return NextResponse.json({error: "Unknown error", ok: false}, {status});
}

export {createErrorResponse, createSuccessResponse};
