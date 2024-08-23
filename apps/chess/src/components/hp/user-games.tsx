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
import {
  getUserGamesData,
  IGetUserGamesData,
} from "@/utils/supabase/requests/server-only/get-user-games";

const formatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

export function UserGamesLoading() {
  return (
    <section className="space-y-5">
      <h2 className="h2">Your games</h2>
      <Skeleton className="w-full h-[200px] rounded" />
    </section>
  );
}

export default async function UserGames({
  providedData,
}: {
  providedData?: IGetUserGamesData;
}) {
  const data = providedData || (await getUserGamesData());
  const gamesData = [...data.gamesData].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <section className="space-y-5">
      <h2 className="h2">Your games</h2>
      {!gamesData?.length && (
        <Alert>
          <AlertTitle>No games available!</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            Seems like you dont have any history of current games.
          </AlertDescription>
        </Alert>
      )}
      {!!gamesData.length && (
        <Table>
          <TableCaption>A list of your game history.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Created at</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Players</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {gamesData.map(game => {
              function getStatus() {
                if (game.gameState === "DRAW") return "Draw";
                if (
                  game.gameState === "CHECKMATE" ||
                  game.gameState === "SURRENDER"
                ) {
                  if (game.winnerId === data.userData.user?.id) return "Won";
                  else return "Lose";
                }
                return "In-game";
              }

              const twoPlayers = game.users.every(u => !!u.id);

              return (
                <TableRow key={game.id}>
                  <TableCell className="font-medium underline">
                    <Link href={`/play/${game.id}`}>
                      {formatter.format(new Date(game.created_at))}
                    </Link>
                  </TableCell>
                  <TableCell>{getStatus()}</TableCell>
                  <TableCell>{twoPlayers ? "2/2" : "1/2"}</TableCell>
                  <TableCell>{game.type}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
