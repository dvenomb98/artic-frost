"use client";

import * as React from "react";
import {createPlayStore, InitialStoreData, PlayStore} from "./store";
import {useStoreWithEqualityFn} from "zustand/traditional";
import {shallow} from "zustand/shallow";
import {createClient} from "@/services/supabase/client";
import {DbPlayTableRow} from "@/services/supabase/types";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";

type PlayStoreApi = ReturnType<typeof createPlayStore>;

const PlayStoreContext = React.createContext<PlayStoreApi | null>(null);

type PlayStoreProviderProps = React.PropsWithChildren<{
  initialStoreData: InitialStoreData;
}>;

/**
 * Provider for the play store.
 * It is used to provide the store to the components.
 * It is also used to create the store if it is not already created.
 *
 */
function PlayStoreProvider({
  children,
  initialStoreData,
}: PlayStoreProviderProps) {
  const supabase = createClient();
  const gameId = initialStoreData.game.id;
  const storeRef = React.useRef<PlayStoreApi>(null);

  if (!storeRef.current) {
    storeRef.current = createPlayStore(initialStoreData);
  }

  React.useEffect(() => {
    const channel = supabase.channel(`play-${gameId}`);

    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "play",
          filter: `id=eq.${gameId}`,
        },
        async (payload: RealtimePostgresChangesPayload<DbPlayTableRow>) => {
          if (storeRef.current) {
            storeRef.current
              .getState()
              .handleSync(payload.new as DbPlayTableRow);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, gameId]);

  return (
    <PlayStoreContext.Provider value={storeRef.current}>
      {children}
    </PlayStoreContext.Provider>
  );
}

const usePlayStore = <T,>(selector: (store: PlayStore) => T): T => {
  const playStoreContext = React.use(PlayStoreContext);

  if (!playStoreContext) {
    throw new Error(`usePlayStore must be used within PlayStoreProvider`);
  }

  return useStoreWithEqualityFn(playStoreContext, selector, shallow);
};

export {PlayStoreProvider, usePlayStore};
