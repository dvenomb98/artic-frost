"use client";

import {createContext} from "react";
import {useUser} from "../hooks/use-user";
import {User} from "@supabase/supabase-js";
import {ProfileSchemaExtended} from "@/services/supabase/models";

type UserClientContextType = {
  user: User | null;
  profile: ProfileSchemaExtended | null;
  loading: boolean;
};

const UserClientContext = createContext<UserClientContextType>({
  user: null,
  profile: null,
  loading: true,
});

function UserClientProvider({children}: {children: React.ReactNode}) {
  const {user, profile, loading} = useUser();

  return (
    <UserClientContext.Provider value={{user, profile, loading}}>
      {children}
    </UserClientContext.Provider>
  );
}

export {UserClientProvider, UserClientContext};
