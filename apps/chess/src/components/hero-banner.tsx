import Spotlight from "@/components/spotlight";

import { ChessPage } from "./chess-page";
import { Badge } from "@artic-frost/ui/components";
import { MatchmakingButton } from "@chess/modules/manager/components/matchmaking-button";
import { CreatePrivateChessGameButton } from "@chess/modules/manager/components/create-private-game-button";

export default function HeroBanner() {
  return (
    <div className="relative overflow-hidden lg:min-h-screen flex flex-col items-start lg:items-center justify-center">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20" />
      <Badge
        variant="secondary"
        size="sm"
        className="top-4 right-4 absolute invisible lg:visible"
      >
        Public Alpha
      </Badge>
      <ChessPage className="gap-4 flex flex-col items-center text-center">
        <Badge variant="secondary" className="block lg:hidden" size="sm">
          Public Alpha
        </Badge>
        <h1 className="h1 pb-1 font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-foreground to-muted-foreground bg-opacity-50">
          Make chess cool, again
        </h1>
        <p className="text-muted-foreground text-center max-w-[600px]">
          Easily play with friends or engine and enjoy the timeless game.
          Analyze, review games and much more.
        </p>
        <div className="flex flex-col lg:flex-row gap-4 justify-center mt-4">
          <MatchmakingButton />
          <CreatePrivateChessGameButton />
        </div>
      </ChessPage>
    </div>
  );
}
