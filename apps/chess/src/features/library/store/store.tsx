import type {WasmChess, Moves, Square} from "wasm-chess";
import {createStore} from "zustand/vanilla";
import {parseError} from "@/lib/error";
import {toast} from "@artic-frost/ui/components";
import type {DbSave} from "../lib/types";
import {libraryClient} from "../api/client";
import {sharedApiClient} from "@/services/shared-api/client";

function createLibraryStore() {
  return createStore<LibraryStore>()((set, get) => ({
    /*
     *
     */
    wasm: null,
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
    currentSave: null,
    /*
     *
     */
    loadSave: async (save: DbSave) => {
      const {wasm, clearSelection} = get();

      try {
        // Load save into current wasm instance
        if (wasm && save.fen) {
          wasm.load_new_fen(save.fen);
        } else {
          // If no wasm instance, create a new one
          const {WasmChess} = await import("wasm-chess");
          set({wasm: new WasmChess(save.fen)});
        }

        clearSelection();
        set({currentSave: save});
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    handleSquareClick: (row: number, col: number) => {
      const {wasm, selectedSquare, moves, clearSelection} = get();

      if (!wasm) throw new Error("No wasm instance");

      if (selectedSquare && moves.length) {
        const move = moves.find(
          move => move.to_row_idx === row && move.to_col_idx === col
        );

        if (move) {
          try {
            wasm.move_piece(move);
            clearSelection();
          } catch (error) {
            toast.error(parseError(error));
          }
          return;
        }
      }

      // Otherwise, get moves for the selected square
      set({selectedSquare: {row, col}});

      if (wasm.is_enemy_square(row, col)) {
        clearSelection();
        return;
      }

      try {
        const newMoves = wasm.get_moves(row, col);
        set({moves: newMoves});
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    clearSelection: () => {
      set({selectedSquare: null, moves: []});
    },
    /*
     *
     */
    clearCurrentSave: () => {
      set({currentSave: null});
    },
    /*
     *
     */
    clearAll: () => {
      set({wasm: null});
      get().clearCurrentSave();
      get().clearSelection();
    },
    /*
     *
     */
    handleDeleteSave: async (save: DbSave) => {
      const {currentSave, clearAll} = get();

      const result = await libraryClient.deleteSave(save.id);

      if (result && result.ok) {
        if (currentSave?.id === save.id) {
          clearAll();
        }
      }
    },
    /*
     *
     */
    handleEditSave: async (id, title) => {
      const result = await sharedApiClient.editPosition({id, title});

      if (result && result.ok) {
        set({currentSave: result.data});
      }
    },
  }));
}

type LibraryStoreState = {
  /*
   *
   */
  wasm: InstanceType<typeof WasmChess> | null;
  /*
   *
   */
  moves: Moves;
  /*
   *
   */
  selectedSquare: Square | null;
  /*
   *
   */
  currentSave: DbSave | null;
};

type LibraryStoreActions = {
  /*
   *
   */
  loadSave: (save: DbSave) => Promise<void>;
  /*
   *
   */
  handleSquareClick: (row: number, col: number) => void;
  /*
   *
   */
  clearSelection: () => void;
  /*
   *
   */
  clearCurrentSave: () => void;
  /*
   *
   */
  clearAll: () => void;
  /*
   *
   */
  handleDeleteSave: (save: DbSave) => Promise<void>;
  /*
   *
   */
  handleEditSave: (id: number, title: string) => Promise<void>;
};

type LibraryStore = LibraryStoreState & LibraryStoreActions;

export {createLibraryStore, type LibraryStore};
