"use client";

import Link from "next/link";
import React, { useActionState } from "react";

import { Input, Label } from "@artic-frost/ui/components";
import { SubmitButton } from "@/components/submit-button";
import { INITIAL_FORM_STATE } from "@/lib/forms/definitions";

import { signIn } from "../form/actions";
import { useActionHandler } from "@/lib/forms";


function EmailSignIn() {
  const [state, formAction] = useActionState(signIn, INITIAL_FORM_STATE);
  const { handleFormSubmit } = useActionHandler(state);

  return (
    <form onSubmit={(e) => handleFormSubmit(e, formAction)} className="grid gap-4">
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
          <Link
            href="/forgot-password"
            className="ml-auto inline-block text-sm underline"
          >
            Forgot your password?
          </Link>
        </div>
        <Input name="password" id="password" type="password" required />
      </div>
      <SubmitButton type="submit" className="w-full">
        Login
      </SubmitButton>
    </form>
  );
}

export { EmailSignIn };
