"use client";

import {Separator} from "@artic-frost/ui/components";
import {getDefaultTitle} from "../lib/get-default-title";
import {useLibraryStore} from "../store/provider";
import {DeleteSaveButton} from "./delete-button";
import {EditPositionButton} from "./edit-position-button";
import {SavePositionButton} from "./save-position-button";

function SaveInfoRow() {
  const {currentSave} = useLibraryStore(state => ({
    currentSave: state.currentSave,
  }));

  if (!currentSave) {
    return <p className="font-bold">Library</p>;
  }

  return (
    <div className="flex items-center justify-between h-full">
      <div className="flex gap-2 items-center h-full">
        <EditPositionButton id={currentSave.id} />
        <DeleteSaveButton save={currentSave} />
        <Separator orientation="vertical" />
        <p className="font-bold text-sm">{getDefaultTitle(currentSave)}</p>
      </div>
      <div>
        <SavePositionButton />
      </div>
    </div>
  );
}

export {SaveInfoRow};
