"use client";

import {DbSavesTableRow} from "@/services/supabase/types";
import {GRID_CN} from "./const";
import {Save} from "./save";
import {useLibraryStore} from "../../store/provider";

function SavesCsr({saves}: {saves: DbSavesTableRow[]}) {
  const {filteredTags} = useLibraryStore(state => ({
    filteredTags: state.filteredTags,
  }));

  const filteredSaves = filteredTags.length
    ? saves.filter(save => save.tags?.some(tag => filteredTags.includes(tag)))
    : saves;

  if (!filteredSaves.length) {
    return (
    <p className="text-sm font-medium p-4 text-muted-foreground">
      No match found
    </p>
    )
  }

  return (
    <ul className={GRID_CN}>
      {filteredSaves.map(save => (
        <Save key={save.id} save={save} />
      ))}
    </ul>
  );
}

export {SavesCsr};
