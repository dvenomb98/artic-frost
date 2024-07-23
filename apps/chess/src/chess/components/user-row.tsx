"use client";
import React from "react";
import { UserIcon, CrownIcon } from "lucide-react";
import { useChessManager } from "../context/chess-state-manager";
import { ChessUser } from "../lib/definitions";
import { cn } from "@ui/lib/utils/cn";

export default function UserRow({ user }: { user: ChessUser }) {
  const {
    isCurrentUserTurn,
    state: { currentUserId },
  } = useChessManager();
  const isCurrent = user.id === currentUserId;
  const isYouString = isCurrent ? " (you)" : "";
  const higlight = isCurrentUserTurn ? isCurrent : !isCurrent;

  return (
    <section className="flex justify-between items-center py-2">
      <div className={cn("flex items-center gap-2", !user.id && "animate-pulse")}>
        <div className="bg-muted p-3 rounded-md w-fit">
          <UserIcon size={30} />
        </div>
        <p className={cn(higlight ? "text-foreground" : "text-muted-foreground", "text-sm")}>
          {user.id ? "Guest_" + user.id.slice(0, 13) + isYouString : "Waiting for opponent..."}
        </p>
      </div>
      {higlight && !!user.id && <CrownIcon size={30} className="animate-pulse" />}
    </section>
  );
}
