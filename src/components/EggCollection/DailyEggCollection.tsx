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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

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
  const [eggsSold, setEggsSold] = useState(0);
  const [collectionData, setCollectionData] = useState<{
    [key: string]: number;
  }>({});
  interface ChartData {
    date: string;
    [key: string]: number | string;
  }

  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetchTodayData();
    fetchChartData();
  }, []);

  const fetchTodayData = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = Timestamp.fromDate(today);

    const q = query(
      collection(db, "egg-collections"),
      where("date", "==", todayTimestamp)
    );

    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      const docData = querySnapshot.docs[0].data();
      const collection: { [key: string]: number } = docData.collection;
      setCollectionData(collection);
      setTotalEggs(
        Object.values(collection).reduce((a: number, b: number) => a + b, 0)
      );
    }
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
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
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
                <div key={type} className="grid grid-cols-4 items-center gap-4">
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
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {eggTypes.map((type, index) => (
              <Bar
                key={type}
                dataKey={type}
                fill={`hsl(${index * 60}, 70%, 50%)`}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default DailyEggCollection;
