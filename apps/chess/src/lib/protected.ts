import "server-only";

import { unauthorized } from "next/navigation";

function registeredOnly(is_anonymous: boolean) {
    if(is_anonymous) {
        unauthorized()
    }
}

export { registeredOnly }