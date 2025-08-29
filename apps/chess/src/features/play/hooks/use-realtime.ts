import * as React from "react";

import {usePlayStore} from "../store/provider";
import {DbPlayTableRow} from "@/services/supabase/types";
import {createClient} from "@/services/supabase/client";
import {RealtimePostgresChangesPayload} from "@supabase/supabase-js";

/**
 * Realtime hook for the play page.
 *
 * Handles the realtime connection to the database.
 *
 */
function useRealtime() {
  const supabase = createClient();

  const {gameId, handleSync} = usePlayStore(state => ({
    gameId: state.game.id,
    handleSync: state.handleSync,
  }));

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
          handleSync(payload.new as DbPlayTableRow);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, gameId, handleSync]);
}

export {useRealtime};
