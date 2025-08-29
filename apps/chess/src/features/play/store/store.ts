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
      const {game, selectedSquare, moves} = get();

      // Perform move if a square is selected and there are moves available
      if (selectedSquare && moves.length) {
        const move = moves.find(
          move => move.to_row_idx === row && move.to_col_idx === col
        );

        if (move) {
          const data = await playClient.makeMove(game.id, move);

          if (data && data.ok) {
            set({selectedSquare: null, moves: []});
          }

          return;
        }
      }

      // Otherwise, get moves for the selected square
      set({selectedSquare: {row, col}});

      const newMoves = await playClient.getMoves(game.id, {
        row,
        col,
      });

      if (newMoves && newMoves.data) {
        set({moves: newMoves.data});
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
