"use client";
import { signUp } from "@/lib/supabase/actions/auth";
import { Input, Label } from "@ui/components";
import React, { useEffect, useState } from "react";
import { SubmitButton } from "../ui/submit-button";
import { formState } from "@/lib/forms/definitions";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function SignUp() {
  const [state, formAction] = useFormState(signUp, formState);
  const [key, setKey] = useState<number>(0);

  function callAction(formData: FormData) {
    formAction(formData);
    setKey(prev => prev + 1);
  }

  useEffect(() => {
    if (!!state.message) {
      if (state.success) {
        toast.success(state.message);
      } else toast.error(state.message);
    }
  }, [state.message, key]);

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
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input name="password" id="password" type="password" required />
      </div>
      <SubmitButton type="submit" className="w-full">
        Sign up
      </SubmitButton>
    </form>
  );
}
