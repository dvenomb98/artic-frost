"use client";
import React, { useOptimistic } from "react";
import ChatInput from "./chat-input";
import { ScrollArea } from "@ui/components/ui/scroll-area";
import { submitComment } from "@/utils/supabase/actions/chess";
import { useChessManager } from "../context/chess-state-manager";
import { Chat as TChat } from "../lib/definitions";
import { convertTimestampToTime } from "../lib/utils";
import { cn } from "@ui/lib/utils/cn";

export default function Chat() {
  const {
    state: { id, chat, currentUserId },
  } = useChessManager();

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
    await updatedCommentAction(formData);
  }

  return (
    <div className="text-sm flex flex-col space-y-3 h-full">
      <h4 className="font-medium">Chat</h4>
      {!optimisticChat?.length && <p className="text-muted-foreground">No messages found.</p>}
      <ScrollArea className="flex flex-col flex-1 gap-1">
        {optimisticChat?.map((chat, index) => {
          const isCurrentUser = chat.userId === currentUserId;
          const title = isCurrentUser ? "(You)" : "(Opponent)";
          return (
            <div key={index}>
              <p className="text-xs text-muted-foreground text-center">
                {chat.timestamp ? convertTimestampToTime(chat.timestamp) : "Sending..."}
              </p>
              <div
                className={cn(
                  "flex items-center justify-start gap-2 py-2",
                  !isCurrentUser && "flex-row-reverse self-end"
                )}
              >
                <p>{title}</p>
                <p className="text-muted-foreground">{chat.text}</p>
              </div>
            </div>
          );
        })}
      </ScrollArea>
      <form className="flex" action={submit}>
        <ChatInput />
      </form>
    </div>
  );
}
