import {Canvas} from "@/features/core/canvas";
import {CoreStoreProvider} from "@/features/core/store/provider";
import {Ui} from "@/features/core/ui/ui";

function Page() {
  return (
    <CoreStoreProvider>
      <Ui>
        <Canvas />
      </Ui>
    </CoreStoreProvider>
  );
}

export default Page;
