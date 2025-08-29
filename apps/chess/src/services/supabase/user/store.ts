import {User} from "@supabase/supabase-js";

import {createStore} from "zustand/vanilla";

type InitialStoreData = {
  user: User;
};

function createUserStore(initialStoreData: InitialStoreData) {
  return createStore<UserStore>()((set, get) => ({
    ...initialStoreData,
  }));
}

type UserStoreState = {
  /**
   * Current user.
   */
  user: User;
};

type UserStoreActions = {};

type UserStore = UserStoreState & UserStoreActions;

export {createUserStore};
export type {InitialStoreData, UserStore, UserStoreActions, UserStoreState};
