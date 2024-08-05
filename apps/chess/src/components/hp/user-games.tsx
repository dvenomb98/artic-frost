import { RawGameData } from "@/utils/supabase/definitions";
import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/utils/supabase/tables";
import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@ui/components/ui/alert";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@ui/components/ui/table";
import Link from "next/link";
import { Skeleton } from "@ui/components/ui/skeleton";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export default async function UserGames() {
  const client = createClient();
  const { data: userData, error: userError } = await client.auth.getUser();
  if (userError) throw userError;

  const { data: gamesData, error: gamesError } = await client
    .from(Tables.GAMES_DATA)
    .select("*")
    .filter("users", "cs", JSON.stringify([{ id: userData.user.id }]))
    .returns<RawGameData[]>();

  if (gamesError) throw gamesError;

  return (
    <section className="container py-10 space-y-5">
      <h2 className="h2">Your games</h2>
      {!gamesData?.length && (
        <Alert>
          <AlertTitle>No games available!</AlertTitle>
          <AlertDescription>
            Seems like you dont have any history of current games.
          </AlertDescription>
        </Alert>
      )}
      <Table>
        <TableCaption>A list of your game history.</TableCaption>
        <TableHeader>
          <TableHead>Created at</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Players</TableHead>
        </TableHeader>
        <TableBody>
          {gamesData.map((game) => {
            function getStatus() {
              if (game.gameState === "DRAW") return "Draw";
              if (game.gameState === "CHECKMATE") {
                if (game.winnerId === userData.user?.id) return "Won";
                else return "Lose";
              }
              return "In-game";
            }

            const twoPlayers = game.users.every((u) => !!u.id);

            return (
              <TableRow key={game.id}>
                <TableCell className="font-medium underline">
                  <Link href={`/play/${game.id}`}>
                    {formatter.format(new Date(game.created_at))}
                  </Link>
                </TableCell>
                <TableCell>{getStatus()}</TableCell>
                <TableCell>{twoPlayers ? "2/2" : "1/2"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </section>
  );
}

export function UserGamesLoading() {
  return (
    <section className="container py-10 space-y-5">
      <h2 className="h2">Your games</h2>
      <Skeleton className="w-full h-[200px] rounded" />
    </section>
  );
}
