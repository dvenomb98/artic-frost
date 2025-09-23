import {User} from "@supabase/supabase-js";

import {createStore} from "zustand/vanilla";
import {createClient} from "../client";
import {toast} from "@artic-frost/ui/components";
import {parseError} from "@/lib/error";

type InitialStoreData = {
  user: User;
};

function createUserStore(initialStoreData: InitialStoreData) {
  return createStore<UserStore>()((_set, _get) => ({
    ...initialStoreData,
    logout: async () => {
      const client = createClient();
      const {error} = await client.auth.signOut();
      if (error) {
        toast.error(parseError(error));
      }
    },
  }));
}

type UserStoreState = {
  /**
   * Current user.
   */
  user: User;
};

type UserStoreActions = {
  /**
   * Log out the user.
   */
  logout: () => Promise<void>;
};

type UserStore = UserStoreState & UserStoreActions;

export {createUserStore};
export type {InitialStoreData, UserStore, UserStoreActions, UserStoreState};
