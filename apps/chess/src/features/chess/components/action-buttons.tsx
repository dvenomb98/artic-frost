"use client";

import React from "react";
import Link from "next/link";
import { Flag, EyeIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@ui/components";
import { cn } from "@ui/lib"
import { surrender } from "@/features/chess/api/actions";

import { useChessManager } from "../context/chess-state-manager";


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
      <div className="flex items-center">
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
          <Link href={`/review/${state.id}`} className={cn("w-full gap-2", state.fullMoves === 1 && "pointer-events-none opacity-60")}>
            <EyeIcon />
            Review
          </Link>
        </Button>
      </div>
    </>
  );
}
