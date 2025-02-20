import { SidebarSeparator } from "@artic-frost/ui/components";

import { Resize } from "./resize";
import { Background } from "./background";

function Canvas() {
  return (
    <>
      <Resize />
      <SidebarSeparator />
      <Background />
    </>
  );
}

export { Canvas };
