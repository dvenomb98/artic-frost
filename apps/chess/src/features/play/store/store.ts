import {DbPlayTableRow} from "@/services/supabase/types";
import {createStore} from "zustand/vanilla";

type InitialStoreData = {
  game: DbPlayTableRow;
};

function createPlayStore(initialStoreData: InitialStoreData) {
  return createStore<PlayStore>()((set, get) => ({
    ...initialStoreData,
  }));
}

type PlayStoreState = {
  /**
   * Current game data.
   */
  game: DbPlayTableRow | null;
};

type PlayStoreActions = {};

type PlayStore = PlayStoreState & PlayStoreActions;

export {createPlayStore};
export type {PlayStore, PlayStoreState, PlayStoreActions, InitialStoreData};
