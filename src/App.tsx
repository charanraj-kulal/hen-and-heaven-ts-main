import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddInventoryPage from "./pages/Inventory/AddInventory";
import ManageInventoryPage from "./pages/Inventory/ManageInventory";
import AddProductPage from "./pages/Product/AddProduct";
import OrdersPage from "./pages/Orders/OrdersPage";
import ManageProductPage from "./pages/Product/ManageProduct";
import ProductBuyingPage from "./pages/Products";
import UserCartpage from "./pages/userCartPage";
import LoginRegister from "./pages/LoginRegisterForm";
import Franchise from "./pages/Franchise";
import BulkOrders from "./pages/BulkOrders";
import Sales from "./pages/Sales";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "../src/hooks/UserContext";
import { ThemeProvider } from "../src/components/theme-provider";
import withAuth from "../src/components/withAuth";
// Import global styles
import "../src/css/satoshi.css";
import "../src/css/style.css";
import "./index.css";

// Fonts setup
import "./fonts/GeistVF.woff";
import "./fonts/GeistMonoVF.woff";
import Breeding from "./pages/Breeding";

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAddInventory = withAuth(AddInventoryPage);
const ProtectedManageInventory = withAuth(ManageInventoryPage);
const ProtectedAddProduct = withAuth(AddProductPage);
const ProtectedOrderPage = withAuth(OrdersPage);
const ProtectedManageProduct = withAuth(ManageProductPage);
const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/breeding" element={<Breeding />} />
            <Route path="/franchise" element={<Franchise />} />
            <Route path="/bulk-orders" element={<BulkOrders />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/login-register" element={<LoginRegister />} />
            <Route path="/products" element={<ProductBuyingPage />} />
            <Route path="/cart" element={<UserCartpage />} />
            <Route path="/dashboard" element={<ProtectedDashboard />} />
            <Route index element={<Home />} />
            <Route
              path="/dashboard/add-inventory"
              element={<ProtectedAddInventory />}
            />
            <Route
              path="/dashboard/manage-inventory"
              element={<ProtectedManageInventory />}
            />
            <Route
              path="/dashboard/add-product"
              element={<ProtectedAddProduct />}
            />
            <Route
              path="/dashboard/manage-product"
              element={<ProtectedManageProduct />}
            />
            <Route path="/dashboard/orders" element={<ProtectedOrderPage />} />
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
