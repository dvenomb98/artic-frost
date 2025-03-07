"use client";

import React from "react";
import {SendIcon} from "lucide-react";
import {useFormStatus} from "react-dom";

import {Input} from "@artic-frost/ui/components";
import {SubmitButton} from "@/components/submit-button";

export default function ChatInput() {
  const {pending} = useFormStatus();
  return (
    <>
      <Input
        required
        type="text"
        name="text"
        id="text"
        className="rounded-r-none"
        disabled={pending}
      />
      <SubmitButton className="rounded-l-none">
        <SendIcon size={16} />
      </SubmitButton>
    </>
  );
}
