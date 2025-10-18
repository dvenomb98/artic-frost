"use client";

import {
  Button,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@artic-frost/ui/components";

import {CopyInput} from "@artic-frost/ui/composed";

import {ROUTES} from "@/lib/routes";
import {config} from "@/lib/config";
import {UI_CONFIG} from "@/lib/ui-config";

function InviteDialog({gameId}: {gameId: string}) {
  const inviteLink = `${config.DOMAIN}${ROUTES.APP.PLAY(gameId)}`;

  return (
    <>
      <DialogHeader>
        <DialogTitle>Invite a player</DialogTitle>
        <DialogDescription>
          Share the link to invite a player to a game.
        </DialogDescription>
      </DialogHeader>

      <CopyInput inputProps={{value: inviteLink}} />

      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button
            type="button"
            size={UI_CONFIG.BUTTON.SIZE}
            variant={UI_CONFIG.BUTTON.VARIANT}>
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export {InviteDialog};
