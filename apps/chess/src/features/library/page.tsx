import {Sidebar} from "./components/sidebar";
import {SavePreview} from "./components/save-preview";
import {ChessInset} from "@/components/chess-inset";
import {TopRow} from "./components/top-row";
import {LibraryStoreProvider} from "./store/provider";
import {BottomRow} from "./components/bottom-row";

function Page() {
  return (
    <LibraryStoreProvider>
      <ChessInset
        sidebar={<Sidebar />}
        board={<SavePreview />}
        upperRow={<TopRow />}
        bottomRow={<BottomRow />}
      />
    </LibraryStoreProvider>
  );
}

export {Page};
