"use client";

import {getTranslatedResults} from "@/features/play/lib/get-translated-results";
import {useLibraryStore} from "../store/provider";
import { Badge } from "@artic-frost/ui/components";

function BottomRow() {
  const {wasm} = useLibraryStore(state => ({
    wasm: state.wasm,
  }));
  

  if (!wasm) {
    return null;
  }

  const results = wasm.get_game_result();
  const translatedResult = getTranslatedResults(results);
  const state = wasm.get_state();

  return (
    <div className="flex items-center justify-between h-full">
      <Badge size="sm" variant="secondary">On turn: {state.state.on_turn}</Badge>
      <Badge size="sm" variant="outline">Result: {translatedResult}</Badge>
    </div>
  );
}

export {BottomRow};
