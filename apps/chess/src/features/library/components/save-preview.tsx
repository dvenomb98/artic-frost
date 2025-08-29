"use client";

import {ChessBoard, ChessBoardLayout} from "@/components/chess-board";
import {parse_fen} from "wasm-chess";
import {useSearchParams} from "next/navigation";
import {QUERY_PARAMS} from "@/lib/query";
import {Info} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@artic-frost/ui/components";
import {Suspense} from "react";

function SavePreview() {
  return (
    <Suspense>
      <SavePreviewInner />
    </Suspense>
  );
}

function SavePreviewInner() {
  const searchParams = useSearchParams();
  const saveId = searchParams.get(QUERY_PARAMS.SAVE_ID);
  const saveFen = searchParams.get(QUERY_PARAMS.SAVE_FEN);

  if (!saveId || !saveFen) {
    return <NoSaveSelected />;
  }

  const parsedFen = parse_fen(saveFen);

  return (
    <ChessBoardLayout className="mx-auto">
      <ChessBoard board={parsedFen.board} />
    </ChessBoardLayout>
  );
}

export {SavePreview};

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
