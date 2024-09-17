"use client";
import React from "react";
import { toast } from "sonner";
import { Button } from "@ui/components";
import { createChessGame } from "@/services/supabase/actions/chess";
import { GameType } from "@/chess/lib/definitions";

export default function CreateNewGame() {
  function createChessGameFromToast(type: GameType) {
    toast.dismiss();
    toast.promise(async () => await createChessGame(type), {
      loading: "Creating...",
      error: "Sorry, something went wrong. Please, try again.",
    });
  }
  return (
    <Button
      onClick={() => {
        toast("Select type of the game", {
          action: (
            <div className="flex gap-2 w-full">
              <Button
                size="sm"
                className="w-full"
                onClick={() => createChessGameFromToast("vs")}
              >
                vs Player
              </Button>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => createChessGameFromToast("engine")}
              >
                vs Engine <span className="ml-1 text-sm text-muted-foreground">(alpha)</span>
              </Button>
            </div>
          ),
          className: "flex flex-col gap-2 items-start",
        });
      }}
      className="w-[175px]"
    >
      Create a new game
    </Button>
  );
}
