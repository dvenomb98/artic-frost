"use client";

import React, {useActionState} from "react";

import {SubmitButton} from "@/components/submit-button";
import {playMatchmakingGame} from "../services/actions";
import {INITIAL_FORM_STATE, useActionHandler} from "@/lib/forms";

function MatchmakingButton() {
  const [state, formAction] = useActionState(
    playMatchmakingGame,
    INITIAL_FORM_STATE
  );
  const {handleFormSubmit} = useActionHandler(state);

  return (
    <form onSubmit={e => handleFormSubmit(e, formAction)}>
      <SubmitButton className="w-[175px]">Play</SubmitButton>
    </form>
  );
}

export {MatchmakingButton};
