import {isAuthApiError} from "@supabase/supabase-js";
import z, {ZodError} from "zod/v4";

function parseError(e: unknown): string {
  if (e instanceof ZodError) {
    const formattedError = z.prettifyError(e);
    return `Validation error: ${formattedError}`;
  }

  if (isAuthApiError(e)) {
    return `${e.name}: ${e.message}`;
  }

  if (e instanceof Error) {
    return e.message;
  }

  if (typeof e === "string") {
    return e;
  }

  return "Unknown error: Please try again later.";
}

export {parseError};
