import { logout } from "@/utils/supabase/actions/auth";
import React from "react";
import { SubmitButton } from "../ui/submit-button";
import { LogOut } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function LogoutButton() {
  const client = createClient();
  try {
    const { data } = await client.auth.getUser();
    if (!data.user) return null;
  } catch {
    return null;
  }

  return (
    <form action={logout}>
      <SubmitButton variant={"outline"} size={"icon"}>
        <LogOut size={20} />
      </SubmitButton>
    </form>
  );
}
