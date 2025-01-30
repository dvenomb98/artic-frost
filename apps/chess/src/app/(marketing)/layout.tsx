import { MarketingFooter } from "@/features/marketing/footer";
import { MarketingNavBar } from "@/features/marketing/nav-bar";

function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingNavBar />
      {children}
      <MarketingFooter />
    </>
  );
}

export default MarketingLayout;
