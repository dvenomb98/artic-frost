"use client";

import React, { useState } from "react";
import {
  CopyButton,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@ui/components";
import { useChessManager } from "@/features/chess/context/chess-state-manager";

export default function ShareLinkDialog() {
  const {
    state: { status, id, sessionType },
  } = useChessManager();

  const [open, setOpen] = useState<boolean>(status === "IN_QUEUE" && sessionType === "PRIVATE");
  const link = `${window.location.origin}/play/${id}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Game Link</DialogTitle>
          <DialogDescription>
            Share the link below to invite a friend to your game.
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-2 item-center">
          <Input type="text" readOnly value={link} />
          <CopyButton value={link} className="size-10" variant="outline" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
