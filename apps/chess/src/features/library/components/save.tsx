"use client";

import {Button} from "@artic-frost/ui/components";

import {Play} from "lucide-react";
import {format} from "@/lib/format";
import {EditPositionButton} from "./edit-position-button";
import {useLibraryStore} from "../store/provider";
import {DbSave} from "../lib/types";
import {getDefaultTitle} from "../lib/get-default-title";
import {DeleteSaveButton} from "./delete-button";

function Save({save}: {save: DbSave}) {
  const {loadSave} = useLibraryStore(state => ({
    loadSave: state.loadSave,
    handleDeleteSave: state.handleDeleteSave,
  }));

  const title = getDefaultTitle(save);

  function handleLoad() {
    loadSave(save);
  }

  return (
    <li className="flex flex-col">
      <p className="text-sm">{title}</p>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">
            {getFenPreview(save.fen)}
          </p>
          <p className="text-xs text-muted-foreground">
            Created: {format.date(save.created_at)}
          </p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button onClick={handleLoad} variant="secondary" className="min-w-40">
          <Play className="mr-2" />
          Load
        </Button>
        <EditPositionButton id={save.id} />
        <DeleteSaveButton save={save} />
      </div>
    </li>
  );
}

export {Save};

function getFenPreview(fen: string | null) {
  if (!fen) return "No position data";

  const position = fen.split(" ")[0];
  if (!position) return "Invalid position data";

  const pieces = position.replace(/[0-9/]/g, "");
  return `${pieces.length} pieces on board`;
}
