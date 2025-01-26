import { Suspense } from "react";
import { AlertBar } from "./alert-bar";
import { getUserCurrentGame } from "./request";

async function AlertBarWrapper() {
  const data = await getUserCurrentGame();

  if (!data) return null;

  return (
    <Suspense fallback={null}>
      <AlertBar key={data.id} data={data} />
    </Suspense>
  );
}

export { AlertBarWrapper };
