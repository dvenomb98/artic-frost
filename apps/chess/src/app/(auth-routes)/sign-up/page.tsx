import { SignUp } from "@/features/auth/components/sign-up";
import { ROUTES } from "@/lib/routes";
import Link from "next/link";
import React from "react";

export default function SignUpPage() {
  return (
    <>
      <div className="grid gap-2 mb-4">
        <h1 className="h1">Sign up</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email and password credentials
        </p>
      </div>
      <div className="grid gap-4">
        <SignUp />
      </div>
      <div className="mt-4 text-center text-sm">
        Already have account?{" "}
        <Link href={ROUTES.AUTH.SIGN_IN} className="underline">
          Sign in
        </Link>
      </div>
    </>
  );
}
