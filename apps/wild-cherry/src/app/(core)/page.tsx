import {CanvasCsrOnly} from "@/features/core/canvas-csr-only";
import {CoreStoreProvider} from "@/features/core/store/provider";
import {Ui} from "@/features/core/ui/ui";

function Page() {
  return (
    <CoreStoreProvider>
      <Ui>
        <CanvasCsrOnly />
      </Ui>
    </CoreStoreProvider>
  );
}

export default Page;
