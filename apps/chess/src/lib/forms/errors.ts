import { ZodError } from "zod";
import { FormState } from "./definitions";
import { isAuthApiError } from "@supabase/supabase-js";
import { logDevOnly } from "../log";

function handleFormErrors(e: unknown): FormState {
  
  logDevOnly(e);
  
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

  if(e instanceof Error) {
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

export { handleFormErrors };
