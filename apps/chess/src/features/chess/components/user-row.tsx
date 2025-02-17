"use client";
import React from "react";
import { UserIcon, CrownIcon } from "lucide-react";

import { useChessManager } from "@chess/context/chess-state-manager";
import { cn } from "@artic-frost/ui/lib";
import { getUserMap } from "../store/utils";
import { useUsersInfo } from "../hooks/use-users-info";

export default function UserRow({
  targetUser,
}: {
  targetUser: "current" | "opponent";
}) {
  const {
    isCurrentUserTurn,
    state: { currentUserId, userWhiteId, userBlackId, gameState },
  } = useChessManager();

  const { usersInfo } = useUsersInfo();

  const usersMap = getUserMap(currentUserId, userWhiteId, userBlackId);
  const isCurrent = usersMap[targetUser] === currentUserId;

  const higlight = isCurrentUserTurn ? isCurrent : !isCurrent;

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
          {usersInfo[targetUser].displayName}
        </p>
      </div>
      {higlight && !!usersMap[targetUser] && !gameState && (
        <CrownIcon size={30} className="animate-pulse" />
      )}
    </section>
  );
}
