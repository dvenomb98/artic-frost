import {Canvas} from "@core/modules/canvas/canvas";
import {SidebarLayout} from "@core/modules/sidebar/sidebar-layout";
import {CherryStoreProvider} from "@core/providers/store-provider";

function Page() {
  return (
    <CherryStoreProvider>
      <SidebarLayout>
        <Canvas />
      </SidebarLayout>
    </CherryStoreProvider>
  );
}

export default Page;
