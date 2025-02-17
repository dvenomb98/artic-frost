"use client";

import React from "react";
import { toast } from "sonner";
import { Button } from "@artic-frost/ui/components";
import { createPrivateChessGame } from "../services/actions";

import { GAME_TYPE_SCHEMA } from "@/services/supabase/models";
import { z } from "zod";
import {
  ENGINE_DIFFICULTY_ARRAY,
  EngineDifficultyKeys,
} from "@/services/models";

async function createGamePromise(
  type: z.infer<typeof GAME_TYPE_SCHEMA>,
  difficulty: EngineDifficultyKeys | null
) {
  const message = await createPrivateChessGame(type, difficulty);

  if (message && !message.success) {
    throw new Error(message.message);
  }
}

function CreatePrivateChessGameButton() {
  async function create(
    type: z.infer<typeof GAME_TYPE_SCHEMA>,
    difficulty: EngineDifficultyKeys | null
  ) {
    toast.dismiss();
    toast.promise(createGamePromise(type, difficulty), {
      loading: "Creating a private game...",
      error: err => {
        return err.message;
      },
    });
  }

  function selectEngineConfig() {
    toast.dismiss();
    toast("Select difficulty of the engine", {
      action: (
        <div className="flex flex-row flex-wrap gap-2">
          {ENGINE_DIFFICULTY_ARRAY.map(difficulty => (
            <Button
              key={difficulty}
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => create("engine", difficulty)}
            >
              {difficulty}
            </Button>
          ))}
        </div>
      ),
      className: "flex flex-col gap-2 items-start",
    });
  }

  return (
    <>
      <Button
        onClick={() => {
          toast("Select type of the game", {
            action: (
              <div className="flex gap-2 w-full">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => create("vs", null)}
                >
                  vs Friend
                </Button>
                <Button
                  className="w-full"
                  size="sm"
                  variant="outline"
                  onClick={selectEngineConfig}
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
    </>
  );
}

export { CreatePrivateChessGameButton };
