import "server-only";

import {revalidatePath} from "next/cache";

function revalidateAllPaths() {
  revalidatePath("/", "layout");
}

export {revalidateAllPaths};
