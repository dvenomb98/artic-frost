"use client";

import {FieldDropdownCheckboxes} from "@artic-frost/ui/composed";
import * as React from "react";
import {TAGS_OPTIONS} from "@/lib/translations";
import {UI_CONFIG} from "@/lib/ui-config";
import {useLibraryStore} from "../store/provider";
import {DbTagsTableColumn} from "@/services/supabase/types";

function FilterByTagsButton() {
  const {filteredTags, setFilteredTags} = useLibraryStore(state => ({
    filteredTags: state.filteredTags,
    setFilteredTags: state.setFilteredTags,
  }));

  return (
    <FieldDropdownCheckboxes<DbTagsTableColumn>
      buttonProps={{
        variant: UI_CONFIG.BUTTON.VARIANT,
        size: UI_CONFIG.BUTTON.SIZE,
        className: "max-w-fit",
      }}
      placeholder="Filter by tags"
      options={TAGS_OPTIONS}
      selectedValues={filteredTags}
      onChange={setFilteredTags}
    />
  );
}

export {FilterByTagsButton};
