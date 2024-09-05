import { logout } from "@/lib/supabase/actions/auth";
import React from "react";
import { SubmitButton } from "../ui/submit-button";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { ButtonProps } from "@ui/components";

export default async function LogoutButton({props}: {props?: Omit<ButtonProps, "children">}) {
  const client = createClient();
  try {
    const { data } = await client.auth.getUser();
    if (!data.user) return null;
  } catch {
    return null;
  }

  return (
    <form action={logout}>
      <SubmitButton variant="ghost" size="icon" {...props}>
        <LogOut size={20} />
      </SubmitButton>
    </form>
  );
}
