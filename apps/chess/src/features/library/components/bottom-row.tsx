"use client";

import {getTranslatedResults} from "@/features/play/lib/get-translated-results";
import {useLibraryStore} from "../store/provider";
import {Badge} from "@artic-frost/ui/components";

function BottomRow() {
  const {results, game} = useLibraryStore(state => ({
    game: state.game,
    results: state.results,
  }));

  if (!results || !game) {
    return null;
  }

  const translatedResult = getTranslatedResults(results);

  return (
    <div className="flex items-center justify-between h-full">
      <Badge variant="secondary">On turn: {game.state.on_turn}</Badge>
      <Badge variant="outline">Result: {translatedResult}</Badge>
    </div>
  );
}

export {BottomRow};
