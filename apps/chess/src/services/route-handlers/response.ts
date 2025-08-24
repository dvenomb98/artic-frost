import "server-only";

import {NextResponse} from "next/server";
import {RouteHandlerError, type RouteHandlerSuccess} from "./models";
import {z, ZodError} from "zod/v4";
import {isAuthApiError} from "@supabase/supabase-js";

function createSuccessResponse(
  data: unknown,
  status: number = 200
): NextResponse<RouteHandlerSuccess> {
  return NextResponse.json({data}, {status});
}

function createErrorResponse(
  error: unknown,
  status: number
): NextResponse<RouteHandlerError> {
  if (error instanceof ZodError) {
    const formattedError = z.prettifyError(error);
    return NextResponse.json({error: formattedError}, {status});
  }

  if (error instanceof Error || isAuthApiError(error)) {
    return NextResponse.json({error: error.message}, {status});
  }

  if (typeof error === "string") {
    return NextResponse.json({error}, {status});
  }

  return NextResponse.json({error: "Unknown error"}, {status});
}

export {createErrorResponse, createSuccessResponse};
