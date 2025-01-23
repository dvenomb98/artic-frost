"use client";
import React from "react";
import Link from "next/link";
import { EmailSignIn } from "@/features/auth/components/email-signin";
import { GuestLogin } from "@/features/auth/components/guest-login";

export default function LoginPage() {
  return (
    <>
      <div className="grid gap-2 mb-4">
        <h1 className="h1">Sign in</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below to login to your account, or continue as guest
        </p>
      </div>
      <div className="grid gap-4">
        <EmailSignIn />
        <GuestLogin />
      </div>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/sign-up" className="underline">
          Sign up
        </Link>
      </div>
    </>
  );
}
