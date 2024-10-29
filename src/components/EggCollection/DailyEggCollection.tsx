import React, { useState, useEffect } from "react";
import { db } from "../../../firebase";
import {
  doc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import CardDataStats from "../CardDataStats";
import { Egg, EggOff } from "lucide-react";
import { Button } from "../../components/ui/button";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DefaultLayout from "../../components/Layouts/DefaultLayout";
import Breadcrumb from "../../components/Breadcrumbs/Breadcrumb";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Suspense } from "react";
import ApexChart from "react-apexcharts"; // Import ApexChart component

const eggTypes = [
  "Standard White Eggs",
  "Standard Brown Eggs",
  "Furnished / Enriched / Nest-Laid Eggs",
  "Vitamin-Enhanced Eggs",
  "Vegetarian Eggs",
  "Processed Eggs",
];

const DailyEggCollection: React.FC = () => {
  const [totalEggs, setTotalEggs] = useState(0);
  const [eggsSold] = useState(0);
  const [collectionData, setCollectionData] = useState<{
    [key: string]: number;
  }>({});
  const [chartData, setChartData] = useState<any[]>([]); // ApexChart needs `any[]` type

  useEffect(() => {
    fetchWeeklyData();
    fetchChartData();
  }, []);

  const fetchWeeklyData = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, "egg-collections"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo))
    );

    const querySnapshot = await getDocs(q);
    let total = 0;
    querySnapshot.forEach((doc) => {
      const collection: { [key: string]: number } = doc.data().collection;
      total += Object.values(collection).reduce((a, b) => a + b, 0);
    });
    setTotalEggs(total); // Set total eggs collected over the week
  };

  const fetchChartData = async () => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const q = query(
      collection(db, "egg-collections"),
      where("date", ">=", Timestamp.fromDate(sevenDaysAgo))
    );

    const querySnapshot = await getDocs(q);
    const data = querySnapshot.docs.map((doc) => ({
      date: doc.data().date.toDate().toLocaleDateString(),
      ...doc.data().collection,
    }));
    setChartData(data);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const collection: { [key: string]: number } = {};
    let total = 0;

    eggTypes.forEach((type) => {
      const value = parseInt(formData.get(type) as string) || 0;
      collection[type] = value;
      total += value;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    await setDoc(
      doc(db, "egg-collections", today.toISOString().split("T")[0]),
      {
        date: Timestamp.fromDate(today),
        collection: collection,
      }
    );

    setCollectionData(collection);
    setTotalEggs(total);
    fetchChartData();
    toast.success("Egg collection added successfully!");
  };

  const chartOptions: ApexCharts.ApexOptions = {
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      categories: chartData.map((data) => data.date),
    },
    colors: ["#3C50E0", "#10B981", "#E46060", "#FFC107"],
  };

  const chartSeries = eggTypes.map((type) => ({
    name: type,
    data: chartData.map((data) => data[type] || 0),
  }));

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Daily Egg collection" />

      <div className="grid grid-cols-1 justify-between gap-4 md:grid-cols-2 xl:grid-cols-4">
        <CardDataStats
          title="Total Eggs Collected"
          total={`${totalEggs}`}
          rate="12.40%"
          levelUp
        >
          <Egg />
        </CardDataStats>
        <CardDataStats
          title="Total Eggs Sold"
          total={`${eggsSold}`}
          rate="4.35%"
          levelUp={false}
        >
          <EggOff />
        </CardDataStats>
      </div>
      <div className="rounded-sm border  border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark p-6 mt-4">
        <div className="mt-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add Today's Collection</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add Egg Collection</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                {eggTypes.map((type) => (
                  <div
                    key={type}
                    className="grid grid-cols-4 items-center gap-4"
                  >
                    <Label htmlFor={type} className="text-right">
                      {type}
                    </Label>
                    <Input
                      id={type}
                      name={type}
                      type="number"
                      defaultValue={collectionData[type] || "0"}
                      className="col-span-3"
                    />
                  </div>
                ))}
                <Button type="submit">Save changes</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="mt-4">
          <Suspense fallback={<div>Loading Chart...</div>}>
            <ApexChart
              options={chartOptions}
              series={chartSeries}
              type="bar"
              height={400}
            />
          </Suspense>
        </div>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </DefaultLayout>
  );
};

export default DailyEggCollection;
