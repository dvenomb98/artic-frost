"use client";

import {
  AsyncButton,
  CopyButton,
  Input,
  Label,
} from "@artic-frost/ui/components";
import {playClient} from "../api/client";
import {usePlayStore} from "../store/provider";

import * as React from "react";
import {Flag} from "lucide-react";
import {cn} from "@artic-frost/ui/lib";

const CONTENT_PADDING = "p-5";
const BUTTON_SIZE = "min-w-28";

function Sidebar() {
  return (
    <aside>
      <SidebarHeader />
      <SidebarContent />
    </aside>
  );
}

export {Sidebar};

function SidebarHeader() {
  return (
    <div className={cn("flex items-center h-full border-b", CONTENT_PADDING)}>
      <SidebarButtons />
    </div>
  );
}

function SidebarButtons() {
  const {gameId, opponentConnected} = usePlayStore(state => ({
    opponentConnected: state.opponentConnected,
    gameId: state.game.id,
  }));

  return (
    <div>
      <AsyncButton
        onClick={async () => await playClient.surrender(gameId)}
        variant="secondary"
        disabled={!opponentConnected}
        className={BUTTON_SIZE}
        size="sm">
        <Flag className="mr-2 size-3" />
        Surrender
      </AsyncButton>
    </div>
  );
}

function SidebarContent() {
  const {fen} = usePlayStore(state => ({
    fen: state.game.fen,
  }));

  return (
    <div className={cn("flex items-center h-full border-b", CONTENT_PADDING)}>
      <div className="grid flex-1 gap-2">
        <Label htmlFor="fen">Fen</Label>
        <div className="flex items-center gap-2">
          <Input id="fen" value={fen} readOnly />
          <CopyButton value={fen} variant="secondary" />
        </div>
      </div>
    </div>
  );
}
