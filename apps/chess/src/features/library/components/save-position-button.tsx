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

function SavePositionButton() {
  const router = useRouter();
  const {wasm} = useLibraryStore(state => ({
    wasm: state.wasm,
  }));

  async function handleSave() {
    if (!wasm) throw new Error("No wasm instance");
    const fen = wasm.to_fen();
    await sharedApiClient.savePosition({fen});
    router.refresh();
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <AsyncButton asyncAction={handleSave} variant="secondary" size="icon">
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
