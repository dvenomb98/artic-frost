"use client";

import * as React from "react";

import {ChessBoard, ChessBoardLayout} from "@/components/chess-board";
import {Info, Loader2} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@artic-frost/ui/components";
import {useLibraryStore} from "../store/provider";

function SavePreview() {
  const {wasm, moves, handleSquareClick, currentSave, selectedSquare} = useLibraryStore(
    state => ({
      wasm: state.wasm,
      moves: state.moves,
      handleSquareClick: state.handleSquareClick,
      currentSave: state.currentSave,
      selectedSquare: state.selectedSquare,
    })
  );

  if (!currentSave) {
    return <NoSaveSelected />;
  }

  if (!wasm) {
    return <SavePreviewLoading />;
  }

  const parsedFen = wasm.get_state();

  return (
    <ChessBoardLayout className="mx-auto">
      <ChessBoard
        board={parsedFen.board}
        onSquareClick={handleSquareClick}
        possibleMoves={moves}
        selectedSquare={selectedSquare}
      />
    </ChessBoardLayout>
  );
}

export {SavePreview};

function SavePreviewLoading() {
  return (
    <ChessBoardLayout className="mx-auto">
      <div className="w-full h-full border bg-grid-white/[0.02] rounded grid place-items-center p-10">
        <Loader2 className="size-10 animate-spin" />
      </div>
    </ChessBoardLayout>
  );
}

function NoSaveSelected() {
  return (
    <ChessBoardLayout className="mx-auto">
      <div className="w-full h-full border bg-grid-white/[0.02] rounded grid place-items-center p-10">
        <Alert className="shadow">
          <Info className="size-4" />
          <AlertTitle>No save selected</AlertTitle>
          <AlertDescription>
            Select a save from the library to view it here.
          </AlertDescription>
        </Alert>
      </div>
    </ChessBoardLayout>
  );
}
