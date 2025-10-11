import {User} from "@supabase/supabase-js";

import {createStore} from "zustand/vanilla";
import {createClient} from "../client";
import {toast} from "@artic-frost/ui/components";
import {parseError} from "@/lib/error";
import {DbProfileTableRow} from "../types";
import {sharedApiClient} from "@/services/shared-api/client";
import {generateUserFlags} from "./utils";
import {UserFlags} from "./types";

type InitialStoreData = {
  user: User;
  profile: DbProfileTableRow;
};

function createUserStore(initialStoreData: InitialStoreData) {
  return createStore<UserStore>()((set, _get) => ({
    /*
     *
     */
    ...initialStoreData,
    /*
     *
     */
    flags: generateUserFlags(initialStoreData.user),
    /*
     *
     */
    logout: async () => {
      const client = createClient();
      const {error} = await client.auth.signOut();
      if (error) {
        toast.error(parseError(error));
      }
    },
    /*
     *
     */
    editProfile: async data => {
      const result = await sharedApiClient.editProfile(data);
      if (result.ok) {
        set({profile: result.data});
        toast.success("Profile updated");
      }
    }
  }));
}

type UserStoreState = {
  /**
   * Current user.
   */
  user: User;
  /**
   * Current user's profile.
   */
  profile: DbProfileTableRow;
  /**
   * Flags for the user store.
   */
  flags: UserFlags;

};

type UserStoreActions = {
  /**
   * Log out the user.
   */
  logout: () => Promise<void>;
  /**
   * Edit the user's profile.
   */
  editProfile: (data: {nickname: string}) => Promise<void>;
};

type UserStore = UserStoreState & UserStoreActions;

export {createUserStore};
export type {InitialStoreData, UserStore, UserStoreActions, UserStoreState};
