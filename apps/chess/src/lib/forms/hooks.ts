"use client";

import {useEffect} from "react";
import {toast} from "sonner";

import {startTransition} from "react";
import {FormState} from "./definitions";
import {useRouter} from "next/navigation";

function useActionHandler(state?: FormState) {
  const {push} = useRouter();

  function handleFormSubmit(
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
    if (!state || !state.message) return;

    if (state.success) {
      toast.success(state.message);
      return;
    }

    if (state.redirectUrl) {
      const timeout = setTimeout(() => {
        push(state.redirectUrl!);
      }, 2000);

      return () => clearTimeout(timeout);
    }

    toast.error(state.message);
  }, [state, push]);

  return {handleFormSubmit};
}

export {useActionHandler};
