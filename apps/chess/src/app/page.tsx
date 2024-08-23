import HeroBanner from "@/components/hp/hero-banner";
import HpContent, { HpContentSuspense } from "@/components/hp/hp-content";
import HpNavigation from "@/components/hp/hp-navigation";
import { SEARCH_PARAMS } from "@/utils/pages/definitions";
import { Suspense } from "react";

export default function Home({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const currentParam = Array.isArray(searchParams[SEARCH_PARAMS.VIEW])
    ? searchParams[SEARCH_PARAMS.VIEW]?.[0]
    : (searchParams[SEARCH_PARAMS.VIEW] as string | undefined);

  return (
    <div className="space-y-4">
      <HeroBanner />
      <HpNavigation />
      <div className="py-10 container">
      <Suspense fallback={<HpContentSuspense />}>
          <HpContent currentParam={currentParam} />
      </Suspense>
      </div>
    </div>
  );
}
