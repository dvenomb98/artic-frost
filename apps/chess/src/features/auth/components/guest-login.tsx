"use client";

import React, { useEffect, useState, useActionState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/submit-button";
import { formState } from "@/lib/forms/definitions";

import { loginAsGuest } from "../api/actions";


export default function GuestLogin() {
  const [state, formAction] = useActionState(loginAsGuest, formState);
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
