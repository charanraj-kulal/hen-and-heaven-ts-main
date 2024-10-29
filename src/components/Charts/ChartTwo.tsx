"use client";

import { ApexOptions } from "apexcharts";
import React, { Suspense, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";

import { doc, getDoc } from "firebase/firestore";

import { db } from "../../../firebase";

const options: ApexOptions = {
  colors: ["#3C50E0", "#80CAEE"],
  chart: {
    fontFamily: "Satoshi, sans-serif",
    type: "bar",
    height: 335,
    stacked: true,
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
  },
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "25%",
          },
        },
      },
    },
  ],
  plotOptions: {
    bar: {
      horizontal: false,
      borderRadius: 0,
      columnWidth: "25%",
      borderRadiusApplication: "end",
      borderRadiusWhenStacked: "last",
    },
  },
  dataLabels: {
    enabled: false,
  },
  xaxis: {
    categories: [
      "Expense",
      "Revenue",
      "Capital",
      "Net Profit",
      "Inventory Cost",
      "Total Revenue",
    ],
  },
  legend: {
    position: "top",
    horizontalAlign: "left",
    fontFamily: "Satoshi",
    fontWeight: 500,
    fontSize: "14px",
    markers: {
      size: 5,
    },
  },
  fill: {
    opacity: 1,
  },
};

const ChartTwo: React.FC = () => {
  const [financialData, setFinancialData] = useState({
    expense: 0,
    revenue: 0,
    capital: 0,
    netProfit: 0,
    totalInventoryCost: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "hen-and-heaven", "gNfmJEedFjmg8g6I7vMO");
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFinancialData({
          expense: data.expense || 0,
          revenue: data.revenue || 0,
          capital: data.capital || 0,
          netProfit: data.netProfit || 0,
          totalInventoryCost: data.totalInventoryCost || 0,
          totalRevenue: data.totalRevenue || 0,
        });
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, []);
  const series = [
    {
      name: "Financial Data",
      data: [
        financialData.expense,
        financialData.revenue,
        financialData.capital,
        financialData.netProfit,
        financialData.totalInventoryCost,
        financialData.totalRevenue,
      ],
    },
  ];

  return (
    <div className="col-span-12 rounded-sm border border-stroke bg-white p-7.5 shadow-default dark:border-strokedark dark:bg-boxdark xl:col-span-4">
      <div className="mb-4 justify-between gap-4 sm:flex">
        <div>
          <h4 className="text-xl font-semibold text-black dark:text-white">
            Financial Overview
          </h4>
        </div>
      </div>

      <div>
        <div id="chartTwo" className="-mb-9 -ml-5">
          <Suspense fallback={<div>Loading chart...</div>}>
            <ReactApexChart
              options={options}
              series={series}
              type="bar"
              height={350}
              width={"100%"}
            />
          </Suspense>
        </div>
      </div>

      <div className="mt-4">
        <h5 className="text-lg font-semibold">Financial Details:</h5>
        <ul className="list-disc pl-5">
          <li>Expense: ₹{financialData.expense}</li>
          <li>Revenue: ₹{financialData.revenue}</li>
          <li>Capital: ₹{financialData.capital}</li>
          <li>Net Profit: ₹{financialData.netProfit}</li>
          <li>Total Inventory Cost: ₹{financialData.totalInventoryCost}</li>
          <li>
            Total Revenue: ₹{Math.round(financialData.totalRevenue).toFixed(2)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ChartTwo;
