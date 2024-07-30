"use client";
import { Button } from "@ui/components/ui/button";
import React from "react";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { surrender } from "@/utils/supabase/actions/chess";
import { useChessManager } from "../context/chess-state-manager";

export default function ActionButtons() {
  const { state } = useChessManager();
  function onSurrender() {
    toast.dismiss();
    toast.promise(async () => await surrender(state.id), {
      loading: "Loading...",
      error: "Sorry, something went wrong. Please, try again.",
    });
  }
  return (
    <>
      <div className="flex items-center gap-2">
        <Button
          onClick={() =>
            toast("We are sorry. You should get better", {
              action: (
                <Button variant="destructive" onClick={onSurrender}>
                  Surrender
                </Button>
              ),
            })
          }
          variant="ghost"
          className="w-full gap-2"
        >
          <Flag />
          <span>Surrender</span>
        </Button>
      </div>
    </>
  );
}
