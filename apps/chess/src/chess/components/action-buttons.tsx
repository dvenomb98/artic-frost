"use client";
import { Button } from "@ui/components/ui/button";
import React from "react";
import { Flag, EyeIcon } from "lucide-react";
import { toast } from "sonner";
import { surrender } from "@/utils/supabase/actions/chess";
import { useChessManager } from "../context/chess-state-manager";
import Link from "next/link";
import { cn } from "@ui/lib/utils/cn";

export default function ActionButtons() {
  const { state } = useChessManager();
  function onSurrender() {
    toast.dismiss();
    toast.promise(async () => await surrender(state.id), {
      loading: "Surrendering...",
      error: "Sorry, something went wrong. Please, try again.",
    });
  }
  return (
    <>
      <div className="flex items-center gap-2">
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
        <Button asChild variant="ghost">
          <Link href={`/review/${state.id}`} className={cn("w-full gap-2", !state.halfMoves && "pointer-events-none opacity-60")}>
            <EyeIcon />
            Review
          </Link>
        </Button>
      </div>
    </>
  );
}
