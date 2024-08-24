"use server";

import { revalidateAllPaths } from "@/utils/cache";
import { createClient } from "../server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { FormState } from "@/utils/forms/definitions";
import { handleFormErrors } from "@/utils/forms/errors";

/*
 *
 * Getting Redirect url from cookie, deleting cookie.
 * If user clicked on shared play link and redirecting to that
 *
 */

function handleRedirectUrl(): string | undefined {
  const cookiesStore = cookies();
  const redirectUrl = cookiesStore.get("auth_redirect_url")?.value;

  // remove cookie afterwards
  if (redirectUrl) {
    cookiesStore.delete("auth_redirect_url");
  }
  return redirectUrl;
}

/*
 *
 * Login for guest
 *
 */
async function loginAsGuest() {
  let redirectPath = "";
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    const redirectUrl = handleRedirectUrl();
    redirectPath = redirectUrl || "/";
    revalidateAllPaths();
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    return handleFormErrors(e);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

/*
 *
 * Logout
 *
 */
async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }
  revalidateAllPaths();
  redirect("/");
}

/*
 *
 * Login with email and password
 *
 */
async function login(_: FormState, formData: FormData) {
  let redirectPath = "";
  try {
    const schema = z.object({
      email: z.string().email("Email is invalid!"),
      password: z.string().min(6, "Minimum password length is 6!"),
    });

    const fields = schema.safeParse({
      email: formData?.get("email"),
      password: formData?.get("password"),
    });

    if (!fields.success) throw fields.error;

    const { email, password } = fields.data;
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const redirectUrl = handleRedirectUrl();
    redirectPath = redirectUrl || "/";
    revalidateAllPaths();
    return {
      success: true,
      message: "",
    };
  } catch (e) {
    return handleFormErrors(e);
  } finally {
    if (redirectPath) {
      redirect(redirectPath);
    }
  }
}

/*
 *
 * Sign up with email and password
 *
 */
async function signUp(_: FormState, formData: FormData) {
  try {
    const schema = z.object({
      email: z.string().email("Email is invalid!"),
      password: z.string().min(6, "Minimum password length is 6!"),
    });

    const fields = schema.safeParse({
      email: formData?.get("email"),
      password: formData?.get("password"),
    });

    if (!fields.success) throw fields.error;

    const { email, password } = fields.data;
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo:
          // TODO: Add to envs
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://chess.danielbilek.com",
      },
    });

    if (error) throw error;

    revalidateAllPaths();

    return {
      success: true,
      message:
        "Email was sent. Please check your inbox and confirm your account to continue.",
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { loginAsGuest, logout, login, signUp };
