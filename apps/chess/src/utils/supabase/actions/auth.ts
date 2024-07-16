"use server";

import { revalidateAllPaths } from "@/utils/cache";
import { createClient } from "../server";
import { redirect } from "next/navigation";

async function loginAsGuest() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInAnonymously();

  if (error) {
    throw error;
  }

  revalidateAllPaths();
  redirect("/");
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
