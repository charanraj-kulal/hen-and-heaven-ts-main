import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import LoginRegister from "./pages/LoginRegisterForm";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "../src/hooks/UserContext";
import { ThemeProvider } from "../src/components/theme-provider";
import Loader from "../src/components/common/Loader";

// Import global styles
import "../src/css/satoshi.css"; // Assuming you have these files in the 'css' directory
import "../src/css/style.css";
import "./index.css"; // If you have a globals.css for additional global styles

// Fonts setup (Use proper import paths based on your project structure)
import "./fonts/GeistVF.woff";
import "./fonts/GeistMonoVF.woff";

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);

  // Simulate loading effect
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <UserProvider>
        <Router>
          {loading ? (
            <Loader />
          ) : (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login-register" element={<LoginRegister />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          )}
        </Router>
      </UserProvider>
    </ThemeProvider>
  );
};

export default App;
