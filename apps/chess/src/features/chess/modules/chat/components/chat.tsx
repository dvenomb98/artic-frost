"use client";

import React, { startTransition, useActionState, useOptimistic } from "react";

import { ScrollArea } from "@ui/components";
import { cn } from "@ui/lib";

import { submitComment } from "../actions";
import { useChessManager } from "@/features/chess/context/chess-state-manager";

import { Chat as TChat } from "@/features/chess/store/definitions";
import { convertTimestampToTime } from "@/features/chess/store/utils";

import ChatInput from "./chat-input";
import { INITIAL_FORM_STATE, useActionHandler } from "@/lib/forms";

export default function Chat() {
  const {
    state: { id, chat, currentUserId, type },
  } = useChessManager();

  const [state, action] = useActionState(submitComment, INITIAL_FORM_STATE);
  const { handleFormSubmit } = useActionHandler(state);

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

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.append("gameId", id.toString());

    startTransition(() => {
      addOptimistic({
        text: formData.get("text") as string,
        timestamp: 0,
        userId: currentUserId,
      });
      handleFormSubmit(event, action, formData);
    });
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
    <div className="flex flex-col text-sm space-y-2 h-[300px] lg:h-full">
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
      <form className="mt-auto flex pb-2 px-2" onSubmit={submit}>
        <ChatInput />
      </form>
    </div>
  );
}
