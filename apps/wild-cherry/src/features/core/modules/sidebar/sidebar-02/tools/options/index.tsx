import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@artic-frost/ui/components";

import {Strokes} from "./strokes";
import {Shapes} from "./shapes";

function SidebarOptions() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Customize</SidebarGroupLabel>
      <SidebarGroupContent className="flex gap-2 items-center">
        <Strokes />
        <Shapes />
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export {SidebarOptions};
