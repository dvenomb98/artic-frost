"use client";
import React, { useOptimistic, useRef } from "react";
import ChatInput from "./chat-input";
import { ScrollArea } from "@ui/components";
import { submitComment } from "@/lib/supabase/actions/chess";
import { useChessManager } from "../context/chess-state-manager";
import { Chat as TChat } from "../lib/definitions";
import { convertTimestampToTime } from "../lib/utils";
import { cn } from "@ui/lib";
import { toast } from "sonner";

export default function Chat() {
  const {
    state: { id, chat, currentUserId, type },
  } = useChessManager();

  const formRef = useRef<HTMLFormElement>(null);

  const [optimisticChat, addOptimistic] = useOptimistic(
    chat,
    (currentState, optimisticValue: TChat) => {
      return [
        ...currentState,
        {
          text: optimisticValue.text,
          timestamp: optimisticValue.timestamp,
          userId: optimisticValue.userId,
        },
      ];
    }
  );

  async function submit(formData: FormData) {
    addOptimistic({
      text: formData.get("text") as string,
      timestamp: "",
      userId: currentUserId,
    });
    const updatedCommentAction = submitComment.bind(null, id);
    try {
      await updatedCommentAction(formData);
      formRef?.current?.reset();
    } catch (e) {
      toast.error("Sorry, there was an error. Please try again later");
    }
  }

  if (type === "engine") {
    return (
      <div className="text-sm flex flex-col space-y-2">
        <h4>Chat</h4>
        <p className="text-muted-foreground">
          Chat is disabled vs "engine" game.
        </p>
        <ScrollArea></ScrollArea>
      </div>
    );
  }

  return (
    <div className="flex flex-col text-sm space-y-2 sm:h-[300px] lg:h-full">
      <h4 className="font-medium">Chat</h4>
      <div className="flex-grow overflow-hidden flex flex-col">
        {!optimisticChat?.length && (
          <p className="text-muted-foreground">No messages found.</p>
        )}
        <ScrollArea className="flex-grow">
          <div className="py-1 px-2 space-y-4">
            {optimisticChat?.map((chat, index) => {
              const isCurrentUser = chat.userId === currentUserId;
              const title = isCurrentUser ? "(You)" : "(Opponent)";
              return (
                <div key={index}>
                  <p className="text-xs text-muted-foreground text-center">
                    {chat.timestamp
                      ? convertTimestampToTime(chat.timestamp)
                      : "Sending..."}
                  </p>
                  <div
                    className={cn(
                      "flex items-center justify-start gap-2 py-2",
                      !isCurrentUser && "flex-row-reverse self-end"
                    )}
                  >
                    <p>{title}</p>
                    <p className={cn("text-muted-foreground")}>{chat.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </div>
      <form ref={formRef} className="mt-auto flex pb-2 px-2" action={submit}>
        <ChatInput />
      </form>
    </div>
  );
}
