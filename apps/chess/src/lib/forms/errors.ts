import { ZodError } from "zod";
import { FormState } from "./definitions";
import { isAuthApiError } from "@supabase/supabase-js";

function handleFormErrors(e: unknown): FormState {
  if (e instanceof ZodError) {
    const errors = e.errors.map(error => error.message).join(", ");
    return {
      success: false,
      message: `Validation error: ${errors}`,
    };
  }

  if (isAuthApiError(e)) {
    return {
      success: false,
      message: `${e.name}: ${e.message}`,
    };
  }

  const message =
    (e instanceof Error ? e.message : String(e)) ||
    "Unknown error: Please try again later.";

  return {
    success: false,
    message,
  };
}

export { handleFormErrors };
