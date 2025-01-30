"use client";

import { RAW_GAME_SCHEMA } from "@/services/supabase/models";
import { Button } from "@ui/components";
import Link from "next/link";
import { AlertCircleIcon } from "lucide-react";
import { z } from "zod";
import { usePathname } from "next/navigation";
import { ALLOWED_STATUSES, FORBIDDEN_ALERT_PATHS } from "./const";
import { useEffect, useState } from "react";
import { createClient } from "@/services/supabase/client";
import { Tables } from "@/services/supabase/tables";

import { intervalToDuration, formatDuration } from "date-fns";
import { ROUTES } from "@/lib/routes";

const DATA_TYPE = RAW_GAME_SCHEMA.pick({
  id: true,
  status: true,
  created_at: true,
});

type AlertBarProps = {
  data: z.infer<typeof DATA_TYPE>;
};

function AlertBar({ data }: AlertBarProps) {
  const { id, created_at } = data;
  
  const pathname = usePathname();
  const [searchTime, setSearchTime] = useState<string>("");
  const [currentStatus, setCurrentStatus] = useState(data.status);

  useEffect(() => {
    if (currentStatus === "IN_QUEUE") {
      const interval = setInterval(() => {
        const duration = intervalToDuration({
          start: new Date(created_at),
          end: new Date(),
        });

        const formattedTime = formatDuration(duration, {
          format: ["minutes", "seconds"],
          zero: true,
          delimiter: " : ",
        })
          .replace("minutes", "m")
          .replace("seconds", "s");

        setSearchTime(formattedTime);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentStatus, created_at]);

  useEffect(() => {
    const client = createClient();
    const channel = client.channel(`alert-bar`);

    const subscription = channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: Tables.GAMES_DATA,
          filter: `id=eq.${id}`,
        },
        async payload => {
          const newStatus = payload.new.status;
          setCurrentStatus(newStatus);

          if (!ALLOWED_STATUSES.includes(newStatus)) {
            subscription.unsubscribe();
            channel.unsubscribe();
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
      channel.unsubscribe();
    };
  }, [id]);

  if (FORBIDDEN_ALERT_PATHS.some(path => pathname.startsWith(path)))
    return null;

  if (!ALLOWED_STATUSES.includes(currentStatus)) return null;

  return (
    <div className="flex flex-col md:flex-row px-10 items-center p-5 py-4 md:py-1.5 bg-muted/20 gap-2 md:gap-5 border-b">
      <div className="flex items-center gap-2">
        <AlertCircleIcon size={16} className="text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          {currentStatus === "IN_QUEUE"
            ? `Looking for opponent...${searchTime ? ` (${searchTime})` : ""}`
            : "You have game in progress!"}
        </p>
      </div>
      <Button size="sm" asChild className="h-8">
        <Link href={`${ROUTES.MAIN.PLAY}/${id}`}>
          {currentStatus === "IN_PROGRESS" ? "Continue" : "Visit"}
        </Link>
      </Button>
    </div>
  );
}

export { AlertBar };
