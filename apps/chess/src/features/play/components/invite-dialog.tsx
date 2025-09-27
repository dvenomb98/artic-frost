"use client";

import {
  Button,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@artic-frost/ui/components";

import {ComposedInput} from "@artic-frost/ui/composed";

import {ROUTES} from "@/lib/routes";
import {config} from "@/lib/config";

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
      <div className="flex items-center gap-2">
        <ComposedInput
          label="Link"
          value={inviteLink}
          readOnly
          labelProps={{className: "sr-only"}}
        />
      </div>
      <DialogFooter className="sm:justify-start">
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </>
  );
}

export {InviteDialog};
