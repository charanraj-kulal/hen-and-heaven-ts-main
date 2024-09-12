import React, { Suspense, lazy } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import ChatCard from "../Chat/ChatCard";
import TableOne from "../Tables/TableOne";
import CardDataStats from "../CardDataStats";
import { Eye, HandCoins, HandIcon, ShoppingBag, Users } from "lucide-react";

// Dynamic imports using React lazy
const MapOne = lazy(() => import("../../components/Maps/MapOne"));
const ChartThree = lazy(() => import("../../components/Charts/ChartThree"));

const ECommerce: React.FC = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats title="Total views" total="$3.456K" rate="0.43%" levelUp>
          <Eye />
        </CardDataStats>
        <CardDataStats title="Total Profit" total="$45,2K" rate="4.35%" levelUp>
          <HandCoins />
        </CardDataStats>
        <CardDataStats title="Total Product" total="2.450" rate="2.59%" levelUp>
          <ShoppingBag />
        </CardDataStats>
        <CardDataStats title="Total Users" total="3.456" rate="0.95%" levelDown>
          <Users />
        </CardDataStats>
      </div>
      <div className="grid grid-cols-1 gap-4 xl:gap-7.5">
        <ChartOne />
        <ChartTwo />
        <Suspense fallback={<div>Loading...</div>}>
          <ChartThree />
        </Suspense>
        <TableOne />
        <ChatCard />
        <Suspense fallback={<div>Loading...</div>}>
          <MapOne />
        </Suspense>
      </div>
    </>
  );
};

export default ECommerce;
