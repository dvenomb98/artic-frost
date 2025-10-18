import {DbPlayTableRow} from "@/services/supabase/types";
import {
  Card,
  CardHeader,
  CardTitle,
  Separator,
  Skeleton,
  Badge,
  CardDescription,
} from "@artic-frost/ui/components";
import {Button} from "@artic-frost/ui/components";
import {format} from "@/lib/format";
import {Clock, Play} from "lucide-react";

import * as React from "react";
import {ChessBoard} from "@/components/chess-board";
import Link from "next/link";
import {ROUTES} from "@/lib/routes";
import type {Board} from "wasm-chess";
import {log} from "@/services/logger/log";
import {createGameServer} from "./api/server";
import {UI_CONFIG} from "@/lib/ui-config";

async function LatestGames() {
  return (
    <section>
      <h2 className="h2">From the past</h2>
      <p className="text-muted-foreground">Continue where you left off.</p>
      <Separator className="my-4" />
      <LatestGamesWrapper />
    </section>
  );
}

export {LatestGames};

const CONTAINER_CN = "grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

function LatestGamesWrapper() {
  return (
    <React.Suspense fallback={<LatestGameFallback />}>
      <LatestGamesWrapperInner />
    </React.Suspense>
  );
}

async function LatestGamesWrapperInner() {
  const data = await createGameServer.getGames();

  if (!data.length) {
    return (
      <p className="text-muted-foreground text-lg py-10">
        You don't have any games currently in progress. Start your chess journey
        by creating a new game and test your skills!
      </p>
    );
  }

  return (
    <div className={CONTAINER_CN}>
      {data.map(game => (
        <LatestGame key={game.id} game={game} />
      ))}
    </div>
  );
}

async function LatestGame({game}: {game: DbPlayTableRow}) {
  let board: Board | null = null;

  try {
    const {parse_fen} = await import("wasm-chess");
    const parsedFen = parse_fen(game.fen);

    board = parsedFen.board;
  } catch (error) {
    log.error(`Error creating game instance for game ${game.id}`, error);
  }

  return (
    <Link href={ROUTES.APP.PLAY(game.id)}>
      <Card className="relative aspect-square group/card">
        {/* HEADER */}
        <CardHeader>
          <CardTitle>Game #{game.id.slice(-8)}</CardTitle>
          <CardDescription>
            <Badge variant="secondary" className="flex items-center gap-2">
              <Clock className="size-4" />
              <span>{format.date(game.created_at)}</span>
            </Badge>
          </CardDescription>
        </CardHeader>

        {/* HOVER ACTIONS */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
          <Button
            variant={UI_CONFIG.BUTTON.VARIANT}
            size={UI_CONFIG.BUTTON.SIZE}>
            <Play className="size-4 fill-foreground mr-2" />
            Continue
          </Button>
        </div>

        {/* BG */}
        {board && !!board.length && (
          <div className="absolute inset-0 opacity-10">
            <ChessBoard board={board} readOnly />
          </div>
        )}
      </Card>
    </Link>
  );
}

function LatestGameFallback() {
  return (
    <div className={CONTAINER_CN}>
      {Array.from({length: 6}).map((_, i) => (
        <Skeleton key={i} className="aspect-square w-full" />
      ))}
    </div>
  );
}
