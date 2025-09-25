import React from "react";
import MainBanner from "../Components/MainBanner";
import Categories from "../Components/Categories";
import BestSeller from "../Components/BestSeller";
import BottomBanner from "../Components/BottomBanner";
import NewsLetter from "../Components/NewsLetter";

const Home = () => {
  return (
    <div className="mt-10 overflow-x-hidden">
      <MainBanner />
      <Categories />
      <BestSeller />
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};

export default Home;
