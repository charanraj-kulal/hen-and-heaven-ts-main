import { Outlet } from "react-router-dom";
import ECommerce from "../components/Dashboard/E-commerce";
import DefaultLayout from "../components/Layouts/DefaultLayout";

const Dashboard = () => {
  return (
    <DefaultLayout>
      <ECommerce />
      <Outlet />
    </DefaultLayout>
  );
};

export default Dashboard;
