"use client";

import {ChessBoard} from "@/components/chess-board";
import {usePlayStore} from "../store/provider";

function Board() {
  const {board, players, handleSquareClick, moves} = usePlayStore(state => ({
    board: state.parsedFen.board,
    players: state.players,
    handleSquareClick: state.handleSquareClick,
    moves: state.moves,
  }));

  return (
    <ChessBoard
      board={board}
      isRotated={players.current.value === "Black"}
      onSquareClick={handleSquareClick}
      possibleMoves={moves}
    />
  );
}

export {Board};
