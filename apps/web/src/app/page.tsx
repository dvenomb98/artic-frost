import BlogLayout from "@/components/blog/blog-layout";
import HeroBanner from "@/components/hero-banner/hero-banner";
import { NextPage } from "next";

const IndexPage: NextPage = () => {

  return (
    <>
      <HeroBanner />
      <div className="page-container"><BlogLayout /></div>
    </>
  );
};

export default IndexPage;
