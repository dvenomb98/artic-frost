"use client";

import {Button, ButtonGroup} from "@artic-frost/ui/components";
import {getDefaultTitle} from "../lib/get-default-title";
import {useLibraryStore} from "../store/provider";
import {SavePositionButton} from "./save-position-button";
import {EditPositionButton} from "./edit-position-button";
import {DeleteSaveButton} from "./delete-button";

import {ArrowLeftIcon, ArrowRightIcon} from "lucide-react";
import {UI_CONFIG} from "@/lib/ui-config";

function TopRow() {
  const {currentSave, handleUndoMove, handleRedoMove, canUndo, canRedo} =
    useLibraryStore(state => ({
      currentSave: state.currentSave,
      handleUndoMove: state.handleUndoMove,
      handleRedoMove: state.handleRedoMove,
      canUndo: state.canUndo,
      canRedo: state.canRedo,
    }));

  if (!currentSave) {
    return <p className="font-bold">Library</p>;
  }

  return (
    <div className="flex items-center justify-between h-full">
      <div className="flex gap-2 items-center h-full">
        <p className="font-bold text-sm">{getDefaultTitle(currentSave)}</p>
      </div>
      <div>
        <ButtonGroup>
          <ButtonGroup>
            <Button
              onClick={handleUndoMove}
              disabled={!canUndo}
              variant={UI_CONFIG.BUTTON.VARIANT}
              size={UI_CONFIG.BUTTON.ICON_SIZE}
              aria-label="Previous">
              <ArrowLeftIcon />
            </Button>
            <Button
              onClick={handleRedoMove}
              disabled={!canRedo}
              variant={UI_CONFIG.BUTTON.VARIANT}
              size={UI_CONFIG.BUTTON.ICON_SIZE}
              aria-label="Next">
              <ArrowRightIcon />
            </Button>
          </ButtonGroup>
          <ButtonGroup>
            <SavePositionButton />
            <EditPositionButton id={currentSave.id} />
            <DeleteSaveButton save={currentSave} />
          </ButtonGroup>
        </ButtonGroup>
      </div>
    </div>
  );
}

export {TopRow};
