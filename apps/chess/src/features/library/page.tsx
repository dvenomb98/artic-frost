import {Sidebar} from "./components/sidebar";
import {SavePreview} from "./components/save-preview";
import {ChessInsent} from "@/components/chess-insent";
import {SaveInfoRow} from "./components/save-info-row";

function Page() {

  return (
    <ChessInsent
      sidebar={<Sidebar />}
      board={<SavePreview />}
      upperRow={<SaveInfoRow />}
    />
  );
}

export {Page};
