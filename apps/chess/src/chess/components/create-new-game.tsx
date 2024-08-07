import React from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import {createChessGame} from "@/utils/supabase/actions/chess"

export default function CreateNewGame() {
  return (
    <form action={createChessGame}>
      <SubmitButton className="w-[175px]">Create a new game</SubmitButton>
    </form>
  );
}
