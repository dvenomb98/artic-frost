"use client";

import React, {useEffect, useMemo, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@artic-frost/ui/components";
import {useChessManager} from "@chess/context/chess-state-manager";
import {getUserRole} from "../store/utils";

export default function EndGameDialog() {
  const {
    state: {winnerId, gameState, userWhiteId},
  } = useChessManager();

  const [open, setOpen] = useState(false);

  const title = useMemo(() => {
    if (gameState === "CHECKMATE" && !!winnerId) {
      const color = getUserRole(winnerId, userWhiteId);
      return `${color} won by checkmate!`;
    }

    if (gameState === "SURRENDER" && !!winnerId) {
      const color = getUserRole(winnerId, userWhiteId);
      return `${color} won by surrender!`;
    }

    if (gameState === "DRAW") return "Game ended as draw!";

    return "";
  }, [winnerId, gameState, userWhiteId]);

  useEffect(() => {
    if (gameState) {
      setOpen(true);
    }
  }, [gameState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="lowercase first-letter:uppercase">
            {title}
          </DialogTitle>
          <DialogDescription>Thank you for playing!</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
