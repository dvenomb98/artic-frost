"use client";

import { useEffect } from "react";
import { toast } from "sonner";

import { startTransition } from "react";
import { FormState } from "./definitions";

function useActionHandler(state: FormState) {
  
  function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
    formAction: (formData: FormData) => void,
    formData?: FormData
  ) {
    event.preventDefault();
    startTransition(() => {
      formAction(formData ?? new FormData(event.currentTarget));
    });
  }

  useEffect(() => {
    if (!state.message) return;

    if (state.success) {
      toast.success(state.message);
      return;
    }

    toast.error(state.message);
  }, [state]);

  return { handleSubmit };
}

export { useActionHandler };
