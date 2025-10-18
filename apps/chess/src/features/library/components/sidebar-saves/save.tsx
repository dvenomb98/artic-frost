"use client";

import {Badge, Button, ButtonGroup} from "@artic-frost/ui/components";

import {Play} from "lucide-react";
import {format} from "@/lib/format";
import {useLibraryStore} from "@/features/library/store/provider";
import {DbSavesTableRow} from "@/services/supabase/types";
import {getDefaultTitle} from "@/features/library/lib/get-default-title";
import {UI_CONFIG} from "@/lib/ui-config";
import {getTranslatedSaveTagLabel} from "@/lib/translations";

function Save({save}: {save: DbSavesTableRow}) {
  const {loadSave} = useLibraryStore(state => ({
    loadSave: state.loadSave,
    handleDeleteSave: state.handleDeleteSave,
  }));

  const title = getDefaultTitle(save);

  function handleLoad() {
    loadSave(save);
  }

  return (
    <li className="flex flex-col gap-2 border-b pb-4">
      <p className="text-sm">{title}</p>
      <div className="flex flex-col gap-1.5">
        <Badge variant="outline">{getFenPreview(save.fen)}</Badge>
        <Badge variant="secondary">
          Created: {format.date(save.created_at)}
        </Badge>
        {!!save.tags?.length && (
          <div className="flex gap-0.5 flex-wrap">
            {save.tags.map(tag => (
              <Badge variant="outline" key={tag}>
                {getTranslatedSaveTagLabel(tag)}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2">
        <ButtonGroup>
          <Button
            onClick={handleLoad}
            variant={UI_CONFIG.BUTTON.VARIANT}
            size={UI_CONFIG.BUTTON.SIZE}>
            <Play className="mr-2" />
            Load
          </Button>
        </ButtonGroup>
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
