"use server";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";
import { revalidateAllPaths } from "@/utils/cache";

export async function loginAsGuest() {
  const supabase = createClient();

  const { error } = await supabase.auth.signInAnonymously()

  if (error) {
    throw error;
  }

  revalidateAllPaths();
  redirect("/");
}


