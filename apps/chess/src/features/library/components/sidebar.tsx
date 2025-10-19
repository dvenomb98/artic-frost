import * as React from "react";

import {AddNewButton} from "./add-new-button";
import {Saves} from "./sidebar-saves/saves";
import {FilterByTagsButton} from "./filter-by-tags-button";

function Sidebar() {
  return (
    <div className="grid">
      <div className="p-4 border-b flex items-center gap-2">
        <AddNewButton />
        <FilterByTagsButton />
      </div>
      <Saves />
    </div>
  );
}

export {Sidebar};
