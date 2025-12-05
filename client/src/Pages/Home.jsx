import React from "react";
import MainBanner from "../Components/MainBanner";
import Categories from "../Components/Categories";
import BestSeller from "../Components/BestSeller";
import BottomBanner from "../Components/BottomBanner";
import NewsLetter from "../Components/NewsLetter";
import LastOrdered from "../Components/LastOrdered";
import { useAppContext } from "../Context/AppContext";
const Home = () => {
  const { user } = useAppContext();
  return (
    <div className="mt-10 overflow-x-hidden">
      <MainBanner />
      <Categories />
      <BestSeller />
      {user ? <LastOrdered /> : " "}
      <BottomBanner />
      <NewsLetter />
    </div>
  );
};

export default Home;
