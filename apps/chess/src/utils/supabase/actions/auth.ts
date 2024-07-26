"use server";

import { revalidateAllPaths } from "@/utils/cache";
import { createClient } from "../server";
import { redirect } from "next/navigation";
import {cookies} from "next/headers"

async function loginAsGuest() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  const cookiesStore = cookies()
  const redirectUrl = cookiesStore.get("auth_redirect_url")?.value
  
  // remove cookie afterwards
  if(redirectUrl) {
    cookiesStore.delete("auth_redirect_url")
  }
 
  revalidateAllPaths();
  redirect(redirectUrl || "/");
}

async function logout() {
  const supabase = createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    throw error;
  }

  revalidateAllPaths();
  redirect("/");
}

export { loginAsGuest, logout };
