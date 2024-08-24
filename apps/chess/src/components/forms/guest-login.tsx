"use client";
import { loginAsGuest } from "@/utils/supabase/actions/auth";
import React, { useEffect, useState } from "react";
import { SubmitButton } from "../ui/submit-button";
import { useFormState } from "react-dom";
import { formState } from "@/utils/forms/definitions";
import { toast } from "sonner";

export default function GuestLogin() {
  const [state, formAction] = useFormState(loginAsGuest, formState);
  const [key, setKey] = useState<number>(0);

  function callAction() {
    formAction();
    setKey(prev => prev + 1);
  }

  useEffect(() => {
    if (!!state?.message) {
      toast.error(state.message);
    }
  }, [state?.message, key]);

  return (
    <form action={callAction}>
      <SubmitButton variant="secondary" className="w-full">
        Continue as guest
      </SubmitButton>
    </form>
  );
}
