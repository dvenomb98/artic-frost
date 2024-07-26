import React from "react";
import { SubmitButton } from "@/components/ui/submit-button";
import { loginAsGuest } from "@/utils/supabase/actions/auth";

export default function LoginPage() {
  return (
    <div className="grid place-content-center min-h-[60dvh] page--layout">
      <section className="p-5 border rounded space-y-4 bg-card text-card-foreground max-w-[500px] shadow-muted-foreground/10 shadow-xl">
        <h2 className="h2">Login</h2>
        <p className="text-muted-foreground text-sm">
          Disclaimer: Only anonymous users are currently allowed
        </p>
        <form action={loginAsGuest}>
          <SubmitButton className="w-full">Continue as guest</SubmitButton>
        </form>
      </section>
    
    </div>
  );
}
