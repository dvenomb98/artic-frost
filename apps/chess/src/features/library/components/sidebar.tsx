import * as React from "react";

import {AddNewButton} from "./add-new-button";
import {Saves} from "./sidebar-saves/saves";

function Sidebar() {
  return (
    <div className="grid">
      <div className="p-4 border-b">
        <AddNewButton />
      </div>
      <Saves />
    </div>
  );
}

export {Sidebar};
