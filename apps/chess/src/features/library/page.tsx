import {Saves} from "./components/saves";
import {SavePreview} from "./components/save-preview";
import {ChessInsent} from "@/components/chess-insent";
import {SaveInfoRow} from "./components/save-info-row";

function Page() {
  return (
    <ChessInsent
      sidebar={<Saves />}
      board={<SavePreview />}
      upperRow={<SaveInfoRow />}
    />
  );
}

export {Page};
