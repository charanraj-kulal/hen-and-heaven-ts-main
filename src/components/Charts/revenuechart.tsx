import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";

// Dynamically import ReactApexChart with no SSR
const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const RevenueNetProfitChart: React.FC = () => {
  const [chartData, setChartData] = useState({
    categories: ["Week 1", "Week 2", "Week 3", "Week 4"],
    revenue: [99660.8, 99660.8, 99660.8, 99660.8],
    netProfit: [3400, 3400, 3400, 3400],
    capital: [200000, 200000, 200000, 200000],
    expense: [2404, 2404, 2404, 2404],
    inventoryCost: [404, 404, 404, 404],
  });

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 350,
      toolbar: {
        show: false,
      },
    },
    colors: ["#3C50E0", "#10B981", "#F59E0B", "#EF4444", "#6366F1"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 2,
    },
    xaxis: {
      categories: chartData.categories,
    },
    yaxis: {
      title: {
        text: "Amount (₹)",
      },
    },
    tooltip: {
      y: {
        formatter: (value) => `₹${value.toLocaleString("en-IN")}`,
      },
    },
    legend: {
      position: "top",
    },
  };

  const series = [
    { name: "Revenue", data: chartData.revenue },
    { name: "Net Profit", data: chartData.netProfit },
    { name: "Capital", data: chartData.capital },
    { name: "Expense", data: chartData.expense },
    { name: "Inventory Cost", data: chartData.inventoryCost },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-5 shadow-default dark:border-strokedark dark:bg-boxdark">
      <h2 className="text-xl font-semibold mb-4">Weekly Financial Overview</h2>
      <div className="mt-4">
        <ReactApexChart
          options={options}
          series={series}
          type="area"
          height={350}
        />
      </div>
    </div>
  );
};

export default RevenueNetProfitChart;
