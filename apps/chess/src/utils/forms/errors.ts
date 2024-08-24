import { ZodError } from "zod";
import { FormState } from "./definitions";
import { isAuthApiError } from "@supabase/supabase-js";

function handleFormErrors(e: any): FormState {
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

    let message = e instanceof Error ? e.message : e
    if(!message) message = "Unknown error: Please, try it again later."
    return {
      success: false,
      message
    };
  

  
}

export { handleFormErrors };
