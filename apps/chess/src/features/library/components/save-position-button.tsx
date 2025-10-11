"use client";

import {
  AsyncButton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@artic-frost/ui/components";
import {Save} from "lucide-react";
import {sharedApiClient} from "@/services/shared-api/client";

import {useLibraryStore} from "../store/provider";
import {useRouter} from "next/navigation";
import {UI_CONFIG} from "@/lib/ui-config";

function SavePositionButton() {
  const router = useRouter();
  const {_wasmInstance} = useLibraryStore(state => ({
    _wasmInstance: state._wasmInstance,
  }));

  async function handleSave() {
    if (!_wasmInstance) throw new Error("No wasm instance");
    const fen = _wasmInstance.to_fen();
    await sharedApiClient.savePosition({fen});
    router.refresh();
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AsyncButton
          asyncAction={handleSave}
          variant={UI_CONFIG.BUTTON.VARIANT}
          size={UI_CONFIG.BUTTON.ICON_SIZE}>
          <Save />
        </AsyncButton>
      </TooltipTrigger>
      <TooltipContent>
        <p>Save position to library, with a new current game state.</p>
      </TooltipContent>
    </Tooltip>
  );
}

export {SavePositionButton};
