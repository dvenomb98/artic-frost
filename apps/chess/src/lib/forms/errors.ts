import {ZodError} from "zod/v4";
import {FormState} from "./definitions";
import {isAuthApiError} from "@supabase/supabase-js";

function handleFormErrors(e: unknown): FormState {
  if (e instanceof ZodError) {
    return {
      success: false,
      message: `Validation error: ${e.message}`,
    };
  }

  if (isAuthApiError(e)) {
    return {
      success: false,
      message: `${e.name}: ${e.message}`,
    };
  }

  if (e instanceof Error) {
    return {
      success: false,
      message: e.message,
    };
  }

  return {
    success: false,
    message: "Unknown error: Please try again later.",
  };
}

export {handleFormErrors};
