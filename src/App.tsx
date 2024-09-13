import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import AddInventoryPage from "./pages/Inventory/AddInventory";
import ManageInventoryPage from "./pages/Inventory/ManageInventory";
import AddProductPage from "./pages/Product/AddProduct";
import ManageProductPage from "./pages/Product/ManageProduct";
import LoginRegister from "./pages/LoginRegisterForm";
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

const ProtectedDashboard = withAuth(Dashboard);
const ProtectedAddInventory = withAuth(AddInventoryPage);
const ProtectedManageInventory = withAuth(ManageInventoryPage);
const ProtectedAddProduct = withAuth(AddProductPage);
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
            <Route path="/login-register" element={<LoginRegister />} />
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
          </Routes>
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
