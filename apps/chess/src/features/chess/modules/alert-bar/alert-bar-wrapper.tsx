import { Suspense } from "react";
import { AlertBarControl } from "./alert-bar";
import { getUserCurrentGame } from "./request";

async function AlertBarWrapper() {
  const data = await getUserCurrentGame();

  if (!data) return null;

  return (
    <Suspense fallback={null}>
      <AlertBarControl key={data.id} data={data} />
    </Suspense>
  );
}

export { AlertBarWrapper };
