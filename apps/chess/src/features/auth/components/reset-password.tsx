"use client";

import React, { useEffect, useState, useActionState } from "react";
import { toast } from "sonner";

import { Input, Label } from "@ui/components";
import { SubmitButton } from "@/components/submit-button";
import { formState } from "@/lib/forms/definitions";

import { resetPassword } from "../api/actions";


export default function ResetPassword() {
  const [state, formAction] = useActionState(resetPassword, formState);
  const [key, setKey] = useState<number>(0);

  function callAction(formData: FormData) {
    formAction(formData);
    setKey(prev => prev + 1);
  }

  useEffect(() => {
    if (!!state?.message) {
      if (state.success) {
        toast.success(state.message);
      } else {
        toast.error(state.message);
      }
    }
  }, [state?.message, key]);

  return (
    <form action={callAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="m@example.com"
          required
        />
      </div>
      <SubmitButton type="submit" className="w-full">
        Send link
      </SubmitButton>
    </form>
  );
}
