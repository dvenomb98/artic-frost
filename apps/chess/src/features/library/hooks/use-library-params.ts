import {QUERY_PARAMS} from "@/lib/query";
import {ROUTES} from "@/lib/routes";
import {useRouter, useSearchParams} from "next/navigation";

import * as React from "react";

function useLibraryParams() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const replaceParams = React.useCallback(
    ({title, id, fen}: {title: string; id?: number; fen?: string}) => {
      const newParams = new URLSearchParams(searchParams);

      if (id) newParams.set(QUERY_PARAMS.SAVE_ID, id.toString());
      if (fen) newParams.set(QUERY_PARAMS.SAVE_FEN, fen);

      newParams.set(QUERY_PARAMS.SAVE_TITLE, title);

      router.replace(`${ROUTES.APP.LIBRARY}?${newParams.toString()}`);
    },
    [searchParams, router]
  );

  return {
    saveId: searchParams.get(QUERY_PARAMS.SAVE_ID),
    saveFen: searchParams.get(QUERY_PARAMS.SAVE_FEN),
    saveTitle: searchParams.get(QUERY_PARAMS.SAVE_TITLE),
    replaceParams,
  };
}

export {useLibraryParams};
