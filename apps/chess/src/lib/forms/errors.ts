import {FormState} from "./definitions";
import {parseError} from "../error";

function handleFormErrors(e: unknown): FormState {
  const message = parseError(e);

  return {
    success: false,
    message,
  };
}

export {handleFormErrors};
