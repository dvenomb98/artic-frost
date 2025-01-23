"use client";

import { surrender } from "./actions";
import { useChessManager } from "@/features/chess/context/chess-state-manager";
import { Button } from "@ui/components";
import { toast } from "sonner";
import { Flag } from "lucide-react";

function SurrenderButton() {
  const { state } = useChessManager();

  function onSurrender() {
    toast.dismiss();
    toast.promise(async () => await surrender(state.id), {
      loading: "Surrendering...",
      error: (message) => `${message}`,
    });
  }
  return (
    <Button
      onClick={() =>
        toast("You should get better, pussy :(", {
          action: (
            <Button variant="destructive" onClick={onSurrender}>
              Surrender
            </Button>
          ),
          className: "flex justify-between",
        })
      }
      variant="ghost"
      className="w-full gap-2"
    >
      <Flag />
      <span>Surrender</span>
    </Button>
  );
}

export { SurrenderButton };
