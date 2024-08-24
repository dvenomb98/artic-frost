import UpdatePassword from "@/components/forms/update-password";
import React from "react";

export default function UpdatePasswordPage() {
  return (
    <>
      <div className="grid gap-2">
        <h1 className="h1">Update your password</h1>
        <p className="text-muted-foreground text-sm">Enter your new password</p>
      </div>
      <div className="grid gap-4">
        <UpdatePassword />
      </div>
    </>
  );
}
