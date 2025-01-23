"use client";

import React, { useActionState } from "react";

import { SubmitButton } from "@/components/submit-button";
import { findGame } from "./actions";
import { INITIAL_FORM_STATE, useActionHandler } from "@/lib/forms";

function FindGameButton() {
  const [state, formAction] = useActionState(findGame, INITIAL_FORM_STATE);
  const { handleSubmit } = useActionHandler(state);

  return (
    <form onSubmit={e => handleSubmit(e, formAction)}>
      <SubmitButton variant="outline" className="w-[175px]">
        Find a game
      </SubmitButton>
    </form>
  );
}

export { FindGameButton };
