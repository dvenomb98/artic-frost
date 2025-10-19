import type {WasmChess, Moves, Square, ParsedFen, GameResult} from "wasm-chess";
import {createStore} from "zustand/vanilla";
import {parseError} from "@/lib/error";
import {toast} from "@artic-frost/ui/components";
import type {
  DbSavesTableRow,
  DbTagsTableColumn,
} from "@/services/supabase/types";
import {libraryClient} from "../api/client";
import {sharedApiClient} from "@/services/shared-api/client";

const INITIAL_STATE: LibraryStoreState = {
  _wasmInstance: null,
  game: null,
  fen: null,
  history: [],
  results: null,
  canUndo: false,
  canRedo: false,
  moves: [],
  selectedSquare: null,
  currentSave: null,
  filteredTags: [],
};

function createLibraryStore() {
  return createStore<LibraryStore>()((set, get) => ({
    ...INITIAL_STATE,
    /*
     *
     */
    loadSave: async (save: DbSavesTableRow) => {
      const {_wasmInstance, setOnChangeStates} = get();

      try {
        // Load save into current wasm instance
        if (_wasmInstance && save.fen) {
          _wasmInstance.load_new_fen(save.fen);
          setOnChangeStates();
        } else {
          // If no wasm instance, create a new one
          const {WasmChess} = await import("wasm-chess");
          const _wasmInstance = new WasmChess(save.fen);
          set({
            _wasmInstance,
          });
          setOnChangeStates();
        }

        set({currentSave: save});
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    handleSquareClick: (row: number, col: number) => {
      const {_wasmInstance, selectedSquare, moves, setOnChangeStates} = get();

      if (!_wasmInstance) throw new Error("No wasm instance");

      if (selectedSquare && moves.length) {
        const move = moves.find(
          move => move.to_row_idx === row && move.to_col_idx === col
        );

        if (move) {
          try {
            _wasmInstance.move_piece(move);
            setOnChangeStates();
          } catch (error) {
            toast.error(parseError(error));
          }
          return;
        }
      }

      // Otherwise, get moves for the selected square
      set({selectedSquare: {row, col}});

      if (_wasmInstance.is_enemy_square(row, col)) {
        set({selectedSquare: null, moves: []});
        return;
      }

      try {
        const newMoves = _wasmInstance.get_moves(row, col);
        set({moves: newMoves});
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    handleDeleteSave: async (save: DbSavesTableRow) => {
      const {currentSave} = get();

      const result = await libraryClient.deleteSave(save.id);

      if (result && result.ok) {
        if (currentSave?.id === save.id) {
          set({...INITIAL_STATE});
        }
      }
    },
    /*
     *
     */
    handleEditSave: async (id, title, tags) => {
      const result = await sharedApiClient.editPosition({id, title, tags});

      if (result && result.ok) {
        set({currentSave: result.data});
      }
    },
    /*
     *
     */
    handleUndoMove: () => {
      const {_wasmInstance, setOnChangeStates} = get();

      if (!_wasmInstance) throw new Error("No wasm instance");

      try {
        _wasmInstance.undo();
        setOnChangeStates();
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    handleRedoMove: () => {
      const {_wasmInstance, setOnChangeStates} = get();
      if (!_wasmInstance) throw new Error("No wasm instance");
      try {
        _wasmInstance.redo();
        setOnChangeStates();
      } catch (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    setOnChangeStates: () => {
      const {_wasmInstance} = get();
      if (!_wasmInstance) throw new Error("No wasm instance");
      set({
        canUndo: _wasmInstance.can_undo(),
        canRedo: _wasmInstance.can_redo(),
        results: _wasmInstance.get_game_result(),
        fen: _wasmInstance.to_fen(),
        game: _wasmInstance.get_state(),
        selectedSquare: null,
        moves: [],
      });
    },
    /*
     *
     */
    setFilteredTags: newTags => {
      set({filteredTags: newTags});
    },
  }));
}

type LibraryStoreState = {
  /*
   *
   */
  _wasmInstance: InstanceType<typeof WasmChess> | null;
  /*
   *
   */
  game: ParsedFen | null;
  /*
   *
   */
  fen: string | null;
  /*
   *
   */
  history: string[];
  /*
   *
   */
  results: GameResult | null;
  /*
   *
   */
  canUndo: boolean;
  /*
   *
   */
  canRedo: boolean;
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
  currentSave: DbSavesTableRow | null;
  /*
   *
   */
  filteredTags: DbTagsTableColumn[];
};

type LibraryStoreActions = {
  /*
   *
   */
  loadSave: (save: DbSavesTableRow) => Promise<void>;
  /*
   *
   */
  handleSquareClick: (row: number, col: number) => void;
  /*
   *
   */
  handleDeleteSave: (save: DbSavesTableRow) => Promise<void>;
  /*
   *
   */
  handleEditSave: (
    id: number,
    title: string,
    tags: DbTagsTableColumn[]
  ) => Promise<void>;
  /*
   *
   */
  handleUndoMove: () => void;
  /*
   *
   */
  handleRedoMove: () => void;
  /*
   *
   */
  setOnChangeStates: () => void;
  /*
   *
   */
  setFilteredTags: (newTags: DbTagsTableColumn[]) => void;
};

type LibraryStore = LibraryStoreState & LibraryStoreActions;

export {createLibraryStore, type LibraryStore};
