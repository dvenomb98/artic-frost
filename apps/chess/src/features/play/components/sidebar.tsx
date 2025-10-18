"use client";

import {
  AsyncButton,
  CopyButton,
  toast,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {playClient} from "../api/client";
import {usePlayStore} from "../store/provider";

import * as React from "react";
import {Flag, Save} from "lucide-react";
import {cn} from "@artic-frost/ui/lib";
import {CopyInput} from "@artic-frost/ui/composed";
import {sharedApiClient} from "@/services/shared-api/client";
import {UI_CONFIG} from "@/lib/ui-config";

const CONTENT_PADDING = "p-5";

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
        asyncAction={() => playClient.surrender(gameId)}
        disabled={!opponentConnected}
        size={UI_CONFIG.BUTTON.SIZE}
        variant={UI_CONFIG.BUTTON.VARIANT}>
        <Flag />
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

  async function handleSave() {
    const {ok} = await sharedApiClient.savePosition({fen});
    if (ok) {
      toast.success("Position saved to library");
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AsyncButton
          className="min-w-32"
          asyncAction={handleSave}
          size={UI_CONFIG.BUTTON.SIZE}
          variant={UI_CONFIG.BUTTON.VARIANT}>
          <Save />
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

  return <CopyInput label="Fen" inputProps={{value: fen}} />;
}
