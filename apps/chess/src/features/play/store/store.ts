import {DbPlayTableRow} from "@/services/supabase/types";
import type {Moves, ParsedFen, Square} from "wasm-chess";
import {createStore} from "zustand/vanilla";

import {playClient} from "../api/client";
import {toast} from "@artic-frost/ui/components";
import {parseError} from "@/lib/error";
import {Players} from "../lib/get-players";

type InitialStoreData = {
  game: DbPlayTableRow;
  players: Players;
  parsedFen: ParsedFen;
};

function createPlayStore(initialStoreData: InitialStoreData) {
  return createStore<PlayStore>()((set, get) => ({
    ...initialStoreData,
    /*
     *
     */
    isOnTurn:
      initialStoreData.players.current.value ===
      initialStoreData.parsedFen.state.on_turn,
    /*
     *
     */
    moves: [],
    /*
     *
     */
    selectedSquare: null,
    /*
     *
     */
    opponentConnected:
      !!initialStoreData.game[initialStoreData.players.opponent.key],
    /*
     *
     */
    handleSquareClick: async (row: number, col: number) => {
      const {game, selectedSquare, moves, parsedFen, isOnTurn} = get();

      // perform move if a square is selected and there are moves available
      if (selectedSquare && moves.length) {
        const move = moves.find(
          move => move.to_row_idx === row && move.to_col_idx === col
        );

        if (move) {
          // optimistic update: immediately update UI state for better UX, then sync with server.
          // we save the previous state to rollback if the server request fails.

          const previousState = structuredClone({
            parsedFen,
            selectedSquare,
            moves,
            isOnTurn,
          });

          try {
            const {WasmChess} = await import("wasm-chess");
            const gameInstance = new WasmChess(game.fen);

            gameInstance.move_piece(move);

            set({
              parsedFen: gameInstance.get_state(),
              isOnTurn: false,
              selectedSquare: null,
              moves: [],
            });
          } catch (error) {
            toast.error(parseError(error));
          }

          const data = await playClient.makeMove(game.id, move);

          if (!data.ok) {
            set(previousState);
          }

          return;
        }
      }

      // otherwise, get moves for the selected square
      set({selectedSquare: {row, col}});

      try {
        const {WasmChess} = await import("wasm-chess");
        const gameInstance = new WasmChess(game.fen);

        if (!gameInstance.is_own_square(row, col)) {
          set({moves: []});
          return;
        }

        const newMoves = gameInstance.get_moves(row, col);

        set({moves: newMoves});
      } catch (e) {
        toast.error(parseError(e));
      }
    },
    /*
     *
     */
    handleSync: async (game: DbPlayTableRow) => {
      const {players} = get();
      try {
        const {parse_fen} = await import("wasm-chess");
        const parsedFen = parse_fen(game.fen);

        set({
          game,
          parsedFen,
          isOnTurn: parsedFen.state.on_turn === players.current.value,
          opponentConnected: !!game[players.opponent.key],
        });
      } catch (error) {
        toast.error(parseError(error));
      }
    },
  }));
}

type PlayStoreState = {
  /**
   * Current game data.
   */
  game: DbPlayTableRow;
  /**
   * Current and opponent players.
   */
  players: Players;
  /**
   * Parsed FEN state of the current game.
   */
  parsedFen: ParsedFen;
  /**
   * Whether the current player is on turn.
   */
  isOnTurn: boolean;
  /**
   * Moves for a given row and column.
   */
  moves: Moves;
  /**
   * Selected square.
   */
  selectedSquare: Square | null;
  /**
   * Is opponent connected?
   */
  opponentConnected: boolean;
};

type PlayStoreActions = {
  /**
   * Sets the current player.
   */
  handleSquareClick: (row: number, col: number) => Promise<void>;
  /**
   * Handles a sync event from the realtime channel.
   */
  handleSync: (game: DbPlayTableRow) => Promise<void>;
};

type PlayStore = PlayStoreState & PlayStoreActions;

export {createPlayStore};
export type {InitialStoreData, PlayStore, PlayStoreActions, PlayStoreState};
