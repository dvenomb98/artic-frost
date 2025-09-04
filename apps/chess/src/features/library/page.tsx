import {Sidebar} from "./components/sidebar";
import {SavePreview} from "./components/save-preview";
import {ChessInsent} from "@/components/chess-insent";
import {SaveInfoRow} from "./components/save-info-row";
import {LibraryStoreProvider} from "./store/provider";

function Page() {
  return (
    <LibraryStoreProvider>
      <ChessInsent
        sidebar={<Sidebar />}
        board={<SavePreview />}
        upperRow={<SaveInfoRow />}
      />
    </LibraryStoreProvider>
  );
}

export {Page};
