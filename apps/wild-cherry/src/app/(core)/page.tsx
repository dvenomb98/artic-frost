import {CanvasCsrOnly} from "@/features/core/canvas-csr-only";
import {EngineProvider} from "@/features/core/engine/provider";
import {CoreStoreProvider} from "@/features/core/store/provider";
import {Ui} from "@/features/core/ui/ui";

function Page() {
  return (
    <CoreStoreProvider>
      <EngineProvider>
        <Ui>
          <CanvasCsrOnly />
        </Ui>
      </EngineProvider>
    </CoreStoreProvider>
  );
}

export default Page;
