import {parseError} from "@/lib/error";
import {toast} from "@artic-frost/ui/components";
import * as React from "react";
import type {Moves, Square, WasmChess} from "wasm-chess";

/**
 *  This hook is used to create a single player chess instance.
 *  Every time the FEN string changes, a new instance is created.
 *
 *  We dont post any queries to db, or api, validating everything on the client side with `wasm-chess`
 *
 */
function useWasmChess(fen: string | null) {
  const [wasm, setWasm] = React.useState<InstanceType<typeof WasmChess> | null>(
    null
  );

  const [moves, setMoves] = React.useState<Moves>([]);
  const [selectedSquare, setSelectedSquare] = React.useState<Square | null>(
    null
  );

  React.useEffect(() => {
    let active = true;

    (async () => {
      const {WasmChess} = await import("wasm-chess");
      if (active) {
        setWasm(new WasmChess(fen));
      }
    })();

    return () => {
      active = false;
    };
  }, [fen]);

  function handleSquareClick(row: number, col: number) {
    if (!wasm) return;

    // Perform move if a square is selected and there are moves available
    if (selectedSquare && moves.length) {
      const move = moves.find(
        move => move.to_row_idx === row && move.to_col_idx === col
      );

      if (move) {
        try {
          wasm.move_piece(move);
          setSelectedSquare(null);
          setMoves([]);
        } catch (error) {
          displayError(error);
        }

        return;
      }
    }

    // Otherwise, get moves for the selected square
    setSelectedSquare({row, col});

    if (wasm.is_enemy_square(row, col)) {
      setSelectedSquare(null);
      setMoves([]);
      return;
    }

    try {
      const newMoves = wasm.get_moves(row, col);
      setMoves(newMoves);
    } catch (error) {
      displayError(error);
    }
  }

  return {wasm, handleSquareClick, moves, selectedSquare};
}

export {useWasmChess};

function displayError(error: unknown) {
  const parsedError = parseError(error);
  toast.error(parsedError);
}
