"use client";

import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
} from "@ui/components";
import { useChessManager } from "@/features/chess/context/chess-state-manager";
import { CopyIcon, CheckIcon } from "lucide-react";

export default function ShareLinkDialog() {
  const {
    state: { users, id },
  } = useChessManager();

  const [open, setOpen] = useState<boolean>(false);
  const [copy, setCopy] = useState<boolean>(false);
  const link = `${window.location.origin}/play/${id}`;

  useEffect(() => {
    const waitingForPlayer = users.some(u => !u.id);
    if (waitingForPlayer) setOpen(true);
  }, []);

  async function handleCopyLink() {
    try {
      setCopy(false);
      await navigator.clipboard.writeText(
        `${window.location.origin}/play/${id}`
      );
      setCopy(true);
    } catch (e) {}
  }

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
          <Button onClick={handleCopyLink} size="icon">
            {copy ? (
              <CheckIcon className="w-5 h-5" />
            ) : (
              <CopyIcon className="w-5 h-5" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
