"use server";

import { revalidateAllPaths } from "@/lib/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { FormState } from "@/lib/forms/definitions";
import { handleFormErrors } from "@/lib/forms/errors";
import { AuthService } from "@/services/supabase/api/server/auth";
import {
  RESET_PASSWORD_SCHEMA,
  SIGN_IN_SCHEMA,
  SIGN_UP_SCHEMA,
  UPDATE_PASSWORD_SCHEMA,
} from "../models/schema";
import { ROUTES } from "@/lib/routes";

/**
 *
 * Getting Redirect url from cookie, deleting cookie.
 * If user clicked on shared play link and was not logged in initially,
 * We redirect to that link after login.
 *
 **/
async function getRedirectUrl() {
  const cookiesStore = await cookies();
  const redirectUrl = cookiesStore.get("auth_redirect_url")?.value;

  // remove cookie afterwards
  if (redirectUrl) {
    cookiesStore.delete("auth_redirect_url");
  }
  return redirectUrl;
}

/**
 *
 * Login for guest
 *
 **/
async function loginAsGuest() {
  let redirectPath = "";
  try {
    await AuthService.signInAnonymously();
    const redirectUrl = await getRedirectUrl();
    redirectPath = redirectUrl || ROUTES.MAIN.INDEX;
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

/**
 *
 * Logout
 *
 **/
async function logout() {
  await AuthService.signOut();
  revalidateAllPaths();
  redirect(ROUTES.INDEX);
}

/**
 *
 * Sign in with email and password
 *
 **/
async function signIn(_: FormState, formData: FormData) {
  let redirectPath = "";

  try {
    const { email, password } = SIGN_IN_SCHEMA.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await AuthService.signIn(email, password);

    const redirectUrl = getRedirectUrl();
    redirectPath = (await redirectUrl) || ROUTES.MAIN.INDEX;
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

/**
 *
 * Sign up with email and password
 *
 **/
async function signUp(_: FormState, formData: FormData) {
  try {
    const { email, password } = SIGN_UP_SCHEMA.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    const data = await AuthService.signUp(email, password);

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

/**
 *
 * Reset password flow
 *
 **/
async function resetPassword(_: FormState, formData: FormData) {
  try {
    const { email } = RESET_PASSWORD_SCHEMA.parse({
      email: formData.get("email"),
    });

    await AuthService.resetPassword(email);

    revalidateAllPaths();
    return {
      success: true,
      message: "Email was sent. Check your inbox to reset your password.",
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

/**
 *
 * Update password
 *
 **/
async function updatePassword(_: FormState, formData: FormData) {
  try {
    const { password } = UPDATE_PASSWORD_SCHEMA.refine(
      data => data.password === data.confirmPassword,
      {
        message: "Passwords do not match!",
      }
    ).parse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    await AuthService.updatePassword(password);

    revalidateAllPaths();

    return {
      success: true,
      message:
        "Password sucessfully updated! You will be redirected in a few seconds...",
      redirectUrl: ROUTES.MAIN.INDEX,
    };
  } catch (e) {
    return handleFormErrors(e);
  }
}

export { loginAsGuest, logout, signIn, signUp, resetPassword, updatePassword };
