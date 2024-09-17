import AnalyticsLayout from "@/components/hp/analytics/analytics-layout";
import { getUserGamesData } from "@/services/supabase/requests/server-only/get-user-games";

export default async function AnalyticsPage() {
  const data = await getUserGamesData();

  return <AnalyticsLayout providedData={data} />;
}
