"use server";

import { revalidateAllPaths } from "@/lib/cache";
import { createClient } from "@/services/supabase/server";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { z } from "zod";
import { FormState } from "@/lib/forms/definitions";
import { handleFormErrors } from "@/lib/forms/errors";

/*
 *
 * Getting Redirect url from cookie, deleting cookie.
 * If user clicked on shared play link and redirecting to that
 *
 */

async function handleRedirectUrl() {
  const cookiesStore = await cookies();
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
    const supabase = await createClient();

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    const redirectUrl = await handleRedirectUrl();
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
  const supabase = await createClient();
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
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;

    const redirectUrl = handleRedirectUrl();
    redirectPath = await redirectUrl || "/";
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
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
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

    if (!data.user?.identities?.length)
      throw new Error("AuthApiError: User with this email already exists!");

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

/*
 *
 * Reset password flow
 *
 */
async function resetPassword(_: FormState, formData: FormData) {
  try {
    const schema = z.object({
      email: z.string().email("Email is invalid!"),
    });

    const fields = schema.safeParse({
      email: formData?.get("email"),
    });

    if (!fields.success) throw fields.error;

    const { email } = fields.data;
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo:
        process.env.NODE_ENV === "development"
          ? "http://localhost:3000"
          : "https://chess.danielbilek.com",
    });

    if (error) throw error;

    revalidateAllPaths();
    return {
      success: true,
      message: "Email was sent. Check your inbox to reset your password.",
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

/*
 *
 * Update password
 *
 */
async function updatePassword(_: FormState, formData: FormData) {
  try {
    const schema = z.object({
      password: z.string().min(6, "Minimum password length is 6 characters."),
      confirmPassword: z
        .string()
        .min(6, "Confirmation password does not have min 6 characters."),
    });

    const fields = schema
      .refine(data => data.password === data.confirmPassword, {
        message: "Passwords dont match!",
      })
      .safeParse({
        password: formData?.get("password"),
        confirmPassword: formData?.get("confirmPassword"),
      });

    if (!fields.success) throw fields.error;

    const { password } = fields.data;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) throw error;

    revalidateAllPaths();
    
    return {
      success: true,
      message:
        "Password sucessfully updated! You will be redirected in a few seconds...",
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { loginAsGuest, logout, login, signUp, resetPassword, updatePassword };