"use client";

import {
  Button,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@artic-frost/ui/components";

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
        <div className="grid flex-1 gap-2">
          <Label htmlFor="link" className="sr-only">
            Link
          </Label>
          <Input id="link" defaultValue={inviteLink} readOnly />
        </div>
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
