import {Sidebar} from "./components/sidebar";
import {SavePreview} from "./components/save-preview";
import {ChessInsent} from "@/components/chess-insent";
import {TopRow} from "./components/top-row";
import {LibraryStoreProvider} from "./store/provider";
import {BottomRow} from "./components/bottom-row";

function Page() {
  return (
    <LibraryStoreProvider>
      <ChessInsent
        sidebar={<Sidebar />}
        board={<SavePreview />}
        upperRow={<TopRow />}
        bottomRow={<BottomRow />}
      />
    </LibraryStoreProvider>
  );
}

export {Page};
