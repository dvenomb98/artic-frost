"use client";

import {
  AsyncButton,
  CopyButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {playClient} from "../api/client";
import {usePlayStore} from "../store/provider";

import * as React from "react";
import {Flag, Save} from "lucide-react";
import {cn} from "@artic-frost/ui/lib";
import {ComposedInput} from "@artic-frost/ui/composed";
import {sharedApiClient} from "@/services/shared-api/client";

const CONTENT_PADDING = "p-5";
const BUTTON_SIZE_CN = "min-w-28";
const ICON_CN = "mr-2 size-3";
const BUTTON_SIZE = "sm";

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
        onClick={() => playClient.surrender(gameId)}
        variant="secondary"
        disabled={!opponentConnected}
        className={BUTTON_SIZE_CN}
        size={BUTTON_SIZE}>
        <Flag className={ICON_CN} />
        Surrender
      </AsyncButton>
    </div>
  );
}

function SidebarContent() {
  return (
    <div className={cn("flex items-center h-full border-b", CONTENT_PADDING)}>
      <div className="space-y-2 w-full">
        <FenInput />
        <SavePositionButton />
      </div>
    </div>
  );
}

function SavePositionButton() {
  const {fen} = usePlayStore(state => ({
    fen: state.game.fen,
  }));

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AsyncButton
          onClick={() => sharedApiClient.savePosition(fen)}
          variant="secondary"
          size={BUTTON_SIZE}
          className={BUTTON_SIZE_CN}>
          <Save className={ICON_CN} />
          Save position
        </AsyncButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add position to library, so you can come back to it later.</p>
      </TooltipContent>
    </Tooltip>
  );
}

function FenInput() {
  const {fen} = usePlayStore(state => ({
    fen: state.game.fen,
  }));

  return (
    <ComposedInput
      label="Fen"
      value={fen}
      readOnly
      rightElement={<CopyButton value={fen} variant="secondary" />}
    />
  );
}
