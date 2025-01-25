"use client";
import React from "react";
import { UserIcon, CrownIcon } from "lucide-react";

import { useChessManager } from "@/chess/context/chess-state-manager";
import { cn } from "@ui/lib";
import { getUserMap } from "../store/utils";

export default function UserRow({
  targetUser,
}: {
  targetUser: "current" | "opponent";
}) {
  const {
    isCurrentUserTurn,
    state: { currentUserId, userWhiteId, userBlackId, gameState },
  } = useChessManager();

  const usersMap = getUserMap(currentUserId, userWhiteId, userBlackId);

  const isCurrent = usersMap[targetUser] === currentUserId;

  const higlight = isCurrentUserTurn ? isCurrent : !isCurrent;
  const prefix = "Guest_";
  const textMap = {
    current: prefix + (usersMap[targetUser] || "").slice(0, 13) + " (you)",
    opponent:
      usersMap["opponent"] === "engine"
        ? "Engine v0.alpha"
        : prefix + (usersMap[targetUser]|| "").slice(0, 13),
  };

  return (
    <section className="flex justify-between items-center py-2">
      <div
        className={cn(
          "flex items-center gap-2",
          !usersMap[targetUser] && "animate-pulse"
        )}
      >
        <div className="bg-muted p-3 rounded-md w-fit">
          <UserIcon size={30} />
        </div>
        <p
          className={cn(
            higlight ? "text-foreground" : "text-muted-foreground",
            "text-sm"
          )}
        >
          {usersMap[targetUser]
            ? textMap[targetUser]
            : "Waiting for opponent..."}
        </p>
      </div>
      {higlight && !!usersMap[targetUser] && !gameState && (
        <CrownIcon size={30} className="animate-pulse" />
      )}
    </section>
  );
}
