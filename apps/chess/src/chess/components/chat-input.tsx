"use client";
import React from "react";
import { Input } from "@ui/components";
import { SubmitButton } from "@/components/ui/submit-button";
import { SendIcon } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function ChatInput() {
  const { pending } = useFormStatus();
  return (
    <>
      <Input required type="text" name="text" id="text" className="rounded-r-none" disabled={pending} />
      <SubmitButton className="rounded-l-none">
        <SendIcon size={16} />
      </SubmitButton>
    </>
  );
}
