import "server-only";

import {NextResponse} from "next/server";
import {
  ERROR_CODES,
  RouteHandlerError,
  SUCCESS_CODES,
  type RouteHandlerSuccess,
} from "./models";
import {parseError} from "@/lib/error";

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
  const errorMessage = parseError(error);

  return NextResponse.json({error: errorMessage, ok: false}, {status});
}

export {createErrorResponse, createSuccessResponse};
