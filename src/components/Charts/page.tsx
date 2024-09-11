"use client";

import React, { Suspense } from "react";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import ChartOne from "../../components/Charts/ChartOne";
import ChartTwo from "../../components/Charts/ChartTwo";

// Use React.lazy to dynamically import ChartThree
const ChartThree = React.lazy(
  () => import("../../components/Charts/ChartThree")
);

const Chart: React.FC = () => {
  return (
    <>
      <Breadcrumb pageName="Chart" />

      <div className="grid grid-cols-12 gap-4 md:gap-6 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />

        {/* Wrap ChartThree in Suspense for loading fallback */}
        <Suspense fallback={<div>Loading Chart Three...</div>}>
          <ChartThree />
        </Suspense>
      </div>
    </>
  );
};

export default Chart;
