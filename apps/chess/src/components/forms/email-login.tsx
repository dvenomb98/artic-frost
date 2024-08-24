"use client";
import { login } from "@/utils/supabase/actions/auth";
import { Input } from "@ui/components/ui/input";
import { Label } from "@ui/components/ui/label";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { SubmitButton } from "../ui/submit-button";
import { formState } from "@/utils/forms/definitions";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function EmailLogin() {
  const [state, formAction] = useFormState(login, formState);
  const [key, setKey] = useState<number>(0);

  function callAction(formData: FormData) {
    formAction(formData);
    setKey(prev => prev + 1);
  }

  useEffect(() => {
    if (!!state?.message) {
      toast.error(state.message);
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
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor="password">Password</Label>
          {/* <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link> */}
        </div>
        <Input name="password" id="password" type="password" required />
      </div>
      <SubmitButton type="submit" className="w-full">
        Login
      </SubmitButton>
    </form>
  );
}
