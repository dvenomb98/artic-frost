"use client";

import React from "react";
import Link from "next/link";
import { EyeIcon } from "lucide-react";
import { Button } from "@artic-frost/ui/components";
import { cn } from "@artic-frost/ui/lib";
import { ROUTES } from "@/lib/routes";

import { useChessManager } from "../context/chess-state-manager";
import { SurrenderButton } from "../modules/manager/components/surrender-button";

export default function ActionButtons() {
  const { state } = useChessManager();

  return (
    <>
      <div className="flex items-center">
        <SurrenderButton />
        <Button asChild variant="ghost">
          <Link
            href={`${ROUTES.MAIN.REVIEW}/${state.id}`}
            className={cn(
              "w-full gap-2",
              state.fullMoves === 1 && "pointer-events-none opacity-60"
            )}
          >
            <EyeIcon />
            Review
          </Link>
        </Button>
      </div>
    </>
  );
}
