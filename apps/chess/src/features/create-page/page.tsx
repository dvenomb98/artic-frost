"use client";

import {CreateForm} from "./create-form";

function Page() {
  return (
    <div className="flex flex-col items-center justify-center h-full gap-10">
      <h1 className="h1">Are you ready to play?</h1>
      <CreateForm />
    </div>
  );
}

export {Page};
