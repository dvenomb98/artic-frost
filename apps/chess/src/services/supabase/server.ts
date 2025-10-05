import "server-only";

import {createServerClient} from "@supabase/ssr";
import {cookies} from "next/headers";
import {Database} from "./database-types";

async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({name, value, options}) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            throw new Error(
              "The `setAll` method was called from a Server Component."
            );
          }
        },
      },
    }
  );
}

async function getUserId() {
  const supabase = await createClient();
  const {data, error} = await supabase.auth.getClaims();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error("getUserId: No claims found");
  }

  return data.claims.sub;
}

export {createClient, getUserId};
