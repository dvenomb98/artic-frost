"use client";

import React, {useActionState} from "react";

import {Input, Label} from "@artic-frost/ui/components";
import {SubmitButton} from "@/components/submit-button";
import {INITIAL_FORM_STATE} from "@/lib/forms/definitions";

import {updatePassword} from "../form/actions";
import {useActionHandler} from "@/lib/forms";

function UpdatePassword() {
  const [state, formAction] = useActionState(
    updatePassword,
    INITIAL_FORM_STATE
  );
  const {handleFormSubmit} = useActionHandler(state);

  return (
    <form
      onSubmit={e => handleFormSubmit(e, formAction)}
      className="grid gap-4">
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

export {UpdatePassword};
