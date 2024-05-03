import HeroBanner from "@/components/hp/hero-banner";
import AnimatedCards from "@/components/hp/animated-cards";
import PulseBeams from "@/components/hp/pulse-beams";



function IndexPage() {
  return (
    <>
      <HeroBanner />
      <PulseBeams />
      <div className="container -mt-24 pb-28">
      <AnimatedCards />
      </div>
    </>
  );
}

export default IndexPage;
