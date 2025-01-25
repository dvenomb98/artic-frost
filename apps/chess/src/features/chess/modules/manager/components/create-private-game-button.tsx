"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@ui/components";
import { createPrivateChessGame } from "../services/actions";

import { GAME_TYPE_SCHEMA } from "@/services/supabase/models";
import { z } from "zod";

async function createPromise(type: z.infer<typeof GAME_TYPE_SCHEMA>) {
  const message = await createPrivateChessGame(type);
  
    if (message && !message.success) {
      throw new Error(message.message);
  }
}

function CreatePrivateChessGameButton() {
  async function create(type: z.infer<typeof GAME_TYPE_SCHEMA>) {
    toast.dismiss();
    toast.promise(createPromise(type), {
      loading: "Creating a private game...",
      error: err => {
        return err.message;
      }
    });
  }

  return (
    <Button
      onClick={() => {
        toast("Select type of the game", {
          action: (
            <div className="flex gap-2 w-full">
              <Button size="sm" className="w-full" onClick={() => create("vs")}>
                vs Friend
              </Button>
              <Button
                className="w-full"
                size="sm"
                variant="outline"
                onClick={() => create("engine")}
              >
                vs Engine{" "}
                <span className="ml-1 text-sm text-muted-foreground">
                  (alpha)
                </span>
              </Button>
            </div>
          ),
          className: "flex flex-col gap-2 items-start",
        });
      }}
      className="w-[175px]"
      variant="outline"
    >
      Private game
    </Button>
  );
}

export { CreatePrivateChessGameButton };
