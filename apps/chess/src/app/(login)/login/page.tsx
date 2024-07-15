import React from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { revalidateAllPaths } from "@/utils/cache";
import { SubmitButton } from "@/components/ui/submit-button";

export default function LoginPage() {

  async function loginAsGuest() {
    "use server";
    const supabase = createClient();

    const { error } = await supabase.auth.signInAnonymously();

    if (error) {
      throw error;
    }

    revalidateAllPaths();
    redirect("/");
  }
  return (
    <div className="grid place-content-center lg:min-h-screen page--layout">
      <section className="p-5 border rounded space-y-4 bg-card text-card-foreground max-w-[500px]">
        <h2 className="h2">Login</h2>
        <p className="text-muted-foreground text-sm">
          Disclaimer: Only anonymous users are currently allowed
        </p>
        <form action={loginAsGuest}>
          <SubmitButton>Continue as guess</SubmitButton>
        </form>
      </section>
    </div>
  );
}
