"use client";
import React, { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

import { SubmitButton } from "@/components/ui/submit-button";
import { findGame } from "@/services/supabase/actions/chess";


const initialState = {
  message: "",
};

export default function FindGame() {
  const [state, formAction] = useFormState(findGame, initialState);
  const [key, setKey] = useState<number>(0);

  function callAction() {
    formAction();
    setKey((prev) => prev + 1);
  }

  // TODO: quick fix because there is no way to reset form?
  useEffect(() => {
    if (!!state.message) {
      toast.error(state.message);
    }
  }, [state.message, key]);

  return (
    <form key={key} action={callAction}>
      <SubmitButton variant="outline" className="w-[175px]">
        Find a game
      </SubmitButton>
    </form>
  );
}
