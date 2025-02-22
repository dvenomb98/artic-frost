import { SidebarSeparator } from "@artic-frost/ui/components";

import { Resize } from "./resize";
import { Background } from "./background";
import { UndoRedo } from "./undo";

function Canvas() {
  return (
    <>
      <Resize />
      <SidebarSeparator />
      <Background />
      <SidebarSeparator />
      <UndoRedo />
    </>
  );
}

export { Canvas };
