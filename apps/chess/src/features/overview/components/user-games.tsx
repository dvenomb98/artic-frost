import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Alert,
  AlertDescription,
  AlertTitle,
} from "@ui/components";
import Link from "next/link";

import { cached_getAnalyticsData } from "../api/request";

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
  const data = await cached_getAnalyticsData();
  const gamesData = [...data.gamesData].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );


  return (
    <section className="space-y-5">
      {!gamesData || !gamesData.length && (
        <Alert>
          <AlertTitle>History Unavailable</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            You have no history of games. Play some games to see your history.
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
                if (game.game_state === "DRAW") return "Draw";
                if (
                  game.game_state === "CHECKMATE" ||
                  game.game_state === "SURRENDER"
                ) {
                  if (game.winner_id === data.userData.id) return "Won";
                  else return "Lose";
                }
                return "In-game";
              }

              const twoPlayers = game.user_white_id && game.user_black_id;

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
