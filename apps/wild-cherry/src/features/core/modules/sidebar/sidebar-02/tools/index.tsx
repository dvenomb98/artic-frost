import { SidebarSeparator } from "@artic-frost/ui/components";

import { SidebarColorPicker } from "./sidebar-color-picker";
import { SidebarTools } from "./sidebar-tools";

function Tools() {
  return (
    <>
      <SidebarTools />
      <SidebarSeparator />
      <SidebarColorPicker />
    </>
  );
}

export { Tools };
