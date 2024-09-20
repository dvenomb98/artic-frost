import AnalyticsLayout from "@/features/analytics/components/analytics-layout";
import { getUserGamesData } from "@/features/analytics/api/requests/get-user-games";

export default async function AnalyticsPage() {
  const data = await getUserGamesData();

  return <AnalyticsLayout providedData={data} />;
}
