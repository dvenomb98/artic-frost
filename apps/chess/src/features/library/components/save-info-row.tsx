"use client";

import {Suspense} from "react";
import {useLibraryParams} from "../hooks/use-library-params";

function SaveInfoRow() {
  return (
    <Suspense>
      <SaveInfoRowInner />
    </Suspense>
  );
}

function SaveInfoRowInner() {
  const {saveId, saveFen, saveTitle} = useLibraryParams();

  if (!saveId || !saveFen || !saveTitle) {
    return <p className="font-bold">Library</p>;
  }

  return (
    <p>
      <span className="font-bold">{saveTitle}</span>
    </p>
  );
}

export {SaveInfoRow};
