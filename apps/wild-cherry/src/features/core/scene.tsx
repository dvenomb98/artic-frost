import {CanvasCsrOnly} from "./canvas-csr-only";
import {EngineProvider} from "./engine/provider";
import {CoreStoreProvider} from "./store/provider";
import {Ui} from "./ui/ui";

function Scene() {
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

export {Scene};
