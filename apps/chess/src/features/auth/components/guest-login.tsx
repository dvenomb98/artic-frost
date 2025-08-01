"use client";

import React, {useActionState} from "react";

import {SubmitButton} from "@/components/submit-button";
import {INITIAL_FORM_STATE} from "@/lib/forms/definitions";

import {loginAsGuest} from "../form/actions";
import {useActionHandler} from "@/lib/forms";

function GuestLogin() {
  const [state, formAction] = useActionState(loginAsGuest, INITIAL_FORM_STATE);
  const {handleFormSubmit} = useActionHandler(state);

  return (
    <form onSubmit={e => handleFormSubmit(e, formAction)}>
      <SubmitButton variant="secondary" className="w-full">
        Continue as guest
      </SubmitButton>
    </form>
  );
}

export {GuestLogin};
