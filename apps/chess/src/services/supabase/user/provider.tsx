"use client";

import * as React from "react";
import {createUserStore, InitialStoreData, UserStore} from "./store";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";

type UserStoreApi = ReturnType<typeof createUserStore>;

const UserStoreContext = React.createContext<UserStoreApi | null>(null);

type UserStoreProviderProps = React.PropsWithChildren<{
  initialStoreData: InitialStoreData;
}>;

/**
 * Provider for the user store to be used in the client.
 *
 */
function UserStoreProvider({
  children,
  initialStoreData,
}: UserStoreProviderProps) {
  const storeRef = React.useRef<UserStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createUserStore(initialStoreData);
  }

  return (
    <UserStoreContext.Provider value={storeRef.current}>
      {children}
    </UserStoreContext.Provider>
  );
}

const useUserStore = <T,>(selector: (store: UserStore) => T): T => {
  const userStoreContext = React.use(UserStoreContext);

  if (!userStoreContext) {
    throw new Error(`useUserStore must be used within UserStoreProvider`);
  }

  return useStoreWithEqualityFn(userStoreContext, selector, shallow);
};

export {UserStoreProvider, useUserStore, type UserStoreProviderProps};
