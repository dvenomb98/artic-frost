import ResetPassword from '@/features/auth/components/reset-password'
import Link from 'next/link'
import React from 'react'

export default function ForgotPassword() {
  return (
    <>
      <div className="grid gap-2 mb-4">
        <h1 className="h1">Reset your password</h1>
        <p className="text-muted-foreground text-sm">
          Enter your email below where we send you link for password recovery
        </p>
      </div>
      <div className="grid gap-4">
        <ResetPassword />
      </div>
      <div className="mt-4 text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </>
  )
}
