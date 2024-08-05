import HeroBanner from "@/components/hp/hero-banner";
import UserGames, { UserGamesLoading } from "@/components/hp/user-games";
import { Suspense } from "react";

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <Suspense fallback={<UserGamesLoading />}>
        <UserGames />
      </Suspense>
    </div>
  );
}
