import {SidebarSeparator} from "@artic-frost/ui/components";

import {SidebarColorPicker} from "./sidebar-color-picker";
import {SidebarTools} from "./sidebar-tools";
import {UndoRedo} from "./sidebar-undo";
import {SidebarOptions} from "./options";

function Tools() {
  return (
    <>
      <SidebarTools />
      <SidebarSeparator />
      <SidebarColorPicker />
      <SidebarSeparator />
      <SidebarOptions />
      <SidebarSeparator />
      <UndoRedo />
    </>
  );
}

export {Tools};
