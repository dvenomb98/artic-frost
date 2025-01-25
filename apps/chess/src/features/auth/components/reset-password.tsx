"use client";

import React, { useEffect, useState, useActionState } from "react";
import { toast } from "sonner";

import { Input, Label } from "@ui/components";
import { SubmitButton } from "@/components/submit-button";
import { INITIAL_FORM_STATE } from "@/lib/forms/definitions";

import { resetPassword } from "../form/actions";
import { useActionHandler } from "@/lib/forms";


function ResetPassword() {
  const [state, formAction] = useActionState(resetPassword, INITIAL_FORM_STATE);
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
      <SubmitButton type="submit" className="w-full">
        Send link
      </SubmitButton>
    </form>
  );
}

export { ResetPassword };
