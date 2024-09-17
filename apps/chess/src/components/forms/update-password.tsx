"use client";
import { updatePassword } from "@/services/supabase/actions/auth";
import { Input, Label } from "@ui/components";
import React, { useEffect, useState } from "react";
import { SubmitButton } from "../ui/submit-button";
import { formState } from "@/lib/forms/definitions";
import { useFormState } from "react-dom";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function UpdatePassword() {
  const [state, formAction] = useFormState(updatePassword, formState);
  const [key, setKey] = useState<number>(0);
  const router = useRouter();

  function callAction(formData: FormData) {
    formAction(formData);
    setKey(prev => prev + 1);
  }

  useEffect(() => {
    if (!!state?.message) {
      if (state.success) {
        toast.success(state.message);
        setTimeout(() => router.push("/"), 3000);
      } else {
        toast.error(state.message);
      }
    }
  }, [state?.message, key]);

  return (
    <form action={callAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="password">New password</Label>
        <Input id="password" name="password" type="password" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirmPassword">Confirm your password</Label>
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
        />
      </div>
      <SubmitButton type="submit" className="w-full">
        Update password
      </SubmitButton>
    </form>
  );
}
