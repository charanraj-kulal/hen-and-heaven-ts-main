import React, { Suspense, useState, useEffect } from "react";
import ChartOne from "../Charts/ChartOne";
import ChartTwo from "../Charts/ChartTwo";
import { db } from "../../../firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import CardDataStats from "../CardDataStats";
import { Eye, HandCoins, ShoppingBag, Users } from "lucide-react";

const ECommerce: React.FC = () => {
  const [financialData, setFinancialData] = useState({
    totalExpenses: 0,
    totalProfit: 0,
    totalProduct: 0,
    totalUsers: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const docRef = doc(db, "hen-and-heaven", "gNfmJEedFjmg8g6I7vMO");
      const docSnap = await getDoc(docRef);

      const usersRef = collection(db, "users");
      const q = query(usersRef, where("userRole", "==", "user"));
      const querySnapshot = await getDocs(q);
      const totalUserRoleUsers = querySnapshot.size;

      if (docSnap.exists()) {
        const data = docSnap.data();
        setFinancialData({
          totalExpenses: data.expense || 0,
          totalProfit: data.netProfit || 0,
          totalProduct: data.totalInventoryCost || 0, // Assuming this represents total product value
          totalUsers: totalUserRoleUsers || 0, // You might need to add this field to your Firestore document
        });
      } else {
        console.log("No such document!");
      }
    };

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "INR",
    }).format(value);
  };

  const calculateRate = (value: number, total: number) => {
    return ((value / total) * 100).toFixed(2) + "%";
  };
  return (
    <>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5">
        <CardDataStats
          title="Total Expenses"
          total={formatCurrency(financialData.totalExpenses)}
          rate={calculateRate(
            financialData.totalExpenses,
            financialData.totalProfit + financialData.totalExpenses
          )}
          levelUp={false}
        >
          <Eye />
        </CardDataStats>
        <CardDataStats
          title="Total Profit"
          total={formatCurrency(financialData.totalProfit)}
          rate={calculateRate(
            financialData.totalProfit,
            financialData.totalProfit + financialData.totalExpenses
          )}
          levelUp={true}
        >
          <HandCoins />
        </CardDataStats>
        <CardDataStats
          title="Total Inventory cost"
          total={formatCurrency(financialData.totalProduct)}
          rate={calculateRate(
            financialData.totalProduct,
            financialData.totalProfit + financialData.totalExpenses
          )}
          levelUp={true}
        >
          <ShoppingBag />
        </CardDataStats>
        <CardDataStats
          title="Total Users"
          total={financialData.totalUsers.toString()}
          rate="N/A"
          levelUp={true}
        >
          <Users />
        </CardDataStats>
      </div>
      <div className="mt-4 grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
        <ChartOne />
        <ChartTwo />

        <Suspense fallback={<div>Loading...</div>}></Suspense>
      </div>
    </>
  );
};

export default ECommerce;
