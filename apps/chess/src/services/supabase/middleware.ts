import "server-only";

import {createServerClient} from "@supabase/ssr";
import {NextResponse, type NextRequest} from "next/server";
import {ROUTES} from "@/lib/routes";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({name, value}) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({name, value, options}) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: Avoid writing any logic between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  const {
    data: {user},
  } = await supabase.auth.getUser();

  if (
    !user &&
    request.nextUrl.pathname !== ROUTES.INDEX &&
    !request.nextUrl.pathname.startsWith(ROUTES.AUTH.INDEX) &&
    !request.nextUrl.pathname.startsWith(ROUTES.AUTH.SIGN_IN) &&
    !request.nextUrl.pathname.startsWith(ROUTES.AUTH.SIGN_UP) &&
    !request.nextUrl.pathname.startsWith(ROUTES.AUTH.FORGOT_PASSWORD) &&
    !request.nextUrl.pathname.startsWith(ROUTES.DOCUMENTS.INDEX) 
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.AUTH.SIGN_IN;

    const noAuthResponse = NextResponse.redirect(url);
    noAuthResponse.cookies.set("auth_redirect_url", request.url);

    return noAuthResponse;
  }

  if (
    user &&
    request.nextUrl.pathname.startsWith(ROUTES.AUTH.SIGN_IN) &&
    request.nextUrl.pathname.startsWith(ROUTES.AUTH.SIGN_UP) &&
    request.nextUrl.pathname.startsWith(ROUTES.AUTH.FORGOT_PASSWORD)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = ROUTES.APP.INDEX;

    const noAuthResponse = NextResponse.redirect(url);
    return noAuthResponse;
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is. If you're
  // creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse;
}
