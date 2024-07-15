import React from "react";
import { loginAsGuest } from "./actions";
import { Button } from "@ui/components/ui/button";

export default function LoginPage() {
  return (
    <div className="grid place-content-center lg:min-h-screen page--layout">
      <section className="p-5 border rounded space-y-4 bg-card text-card-foreground max-w-[500px]">
        <h2 className="h2">Login</h2>
        <p className="text-muted-foreground text-sm">
          Disclaimer: Only anonymous users are currently allowed
        </p>
        <form>
          <Button className="w-full" formAction={loginAsGuest}>Continue as guest</Button>
        </form>
      </section>
    </div>
  );
}
