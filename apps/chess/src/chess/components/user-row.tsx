"use client";
import React from "react";
import { UserIcon, CrownIcon } from "lucide-react";
import { useChessManager } from "../context/chess-state-manager";
import { cn } from "@ui/lib/utils/cn";

export default function UserRow({ targetUser }: { targetUser: "current" | "opponent" }) {
  const {
    isCurrentUserTurn,
    state: { currentUserId, users, gameState },
  } = useChessManager();

  const usersMap = {
    current: users.find((u) => u.id === currentUserId)!,
    opponent: users.find((u) => u.id !== currentUserId)!,
  };

  const isCurrent = usersMap[targetUser].id === currentUserId;
  const isYouString = isCurrent ? " (you)" : "";
  const higlight = isCurrentUserTurn ? isCurrent : !isCurrent;

  return (
    <section className="flex justify-between items-center py-2">
      <div className={cn("flex items-center gap-2", !usersMap[targetUser].id && "animate-pulse")}>
        <div className="bg-muted p-3 rounded-md w-fit">
          <UserIcon size={30} />
        </div>
        <p className={cn(higlight ? "text-foreground" : "text-muted-foreground", "text-sm")}>
          {usersMap[targetUser].id
            ? "Guest_" + usersMap[targetUser].id.slice(0, 13) + isYouString
            : "Waiting for opponent..."}
        </p>
      </div>
      {higlight && !!usersMap[targetUser].id && !gameState && (
        <CrownIcon size={30} className="animate-pulse" />
      )}
    </section>
  );
}
