"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@ui/components/ui/dialog";
import { useChessManager } from "../context/chess-state-manager";

export default function EndGameDialog() {
  const {
    state: { winnerId, gameState, users },
  } = useChessManager();
  const [open, setOpen] = useState(false);
  const title = useMemo(() => {
    if (gameState === "CHECKMATE" && !!winnerId) {
      const color = users.find((u) => winnerId === u.id)!.role;
      return `${color} won by checkmate!`;
    }

    if (gameState === "SURRENDER" && !!winnerId) {
      const color = users.find((u) => winnerId === u.id)!.role;
      return `${color} won by surrender!`;
    }

    if (gameState === "DRAW") return "Game ended as draw!";

    return "";
  }, [winnerId, gameState]);

  useEffect(() => {
    if (!!gameState) setOpen(true);
  }, [gameState]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="lowercase first-letter:uppercase">{title}</DialogTitle>
          <DialogDescription>Thank you for playing!</DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
