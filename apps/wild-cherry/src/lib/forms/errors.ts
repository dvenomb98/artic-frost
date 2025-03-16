import {ZodError} from "zod";
import {FormState} from "./def";

function handleFormErrors(e: unknown): FormState {
  if (e instanceof ZodError) {
    const errors = e.errors.map(error => error.message).join(", ");
    return {
      success: false,
      message: `Validation error: ${errors}`,
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
