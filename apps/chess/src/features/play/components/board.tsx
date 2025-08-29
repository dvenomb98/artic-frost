"use client";

import {cn} from "@artic-frost/ui/lib";
import {usePlayStore} from "../store/provider";
import {BoardSquare} from "./board-square";

function Board() {
  const {board, players} = usePlayStore(state => ({
    board: state.parsedFen.board,
    players: state.players,
  }));

  return (
    <section
      className={cn(
        "grid grid-cols-8 grid-rows-8",
        players.current.value === "Black" && "transform rotate-180"
      )}>
      {board.map((row, rowIndex) =>
        row.map((piece, colIndex) => (
          <BoardSquare
            key={`${rowIndex}-${colIndex}`}
            piece={piece}
            colIndex={colIndex}
            rowIndex={rowIndex}
          />
        ))
      )}
    </section>
  );
}

export {Board};
