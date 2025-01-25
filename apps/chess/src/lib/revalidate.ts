"use server"

import { revalidateAllPaths } from "./cache"

async function revalidateClientCache() {
    revalidateAllPaths();
}

export { revalidateClientCache }
