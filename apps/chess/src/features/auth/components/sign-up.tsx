"use client";

import React, {useActionState} from "react";

import {Input, Label} from "@artic-frost/ui/components";
import {SubmitButton} from "@/components/submit-button";
import {INITIAL_FORM_STATE} from "@/lib/forms/definitions";

import {signUp} from "../form/actions";
import {useActionHandler} from "@/lib/forms";

function SignUp() {
  const [state, formAction] = useActionState(signUp, INITIAL_FORM_STATE);
  const {handleFormSubmit} = useActionHandler(state);

  return (
    <form
      onSubmit={e => handleFormSubmit(e, formAction)}
      className="grid gap-4">
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

export {SignUp};
