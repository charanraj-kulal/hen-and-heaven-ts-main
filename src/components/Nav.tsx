"use client";
import React, { useState } from "react";
import {
  LogIn,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingCartIcon,
} from "lucide-react";
import { Sun, Moon } from "lucide-react";
import {
  HoveredLink,
  MenuItem,
  ProductItem,
} from "../components/ui/navbar-menu";
import { cn } from "../lib/utils";

import { useTheme } from "next-themes";
import { useUser } from "../hooks/UserContext";
import { Link, useNavigate } from "react-router-dom";

// Update the Menu component to accept className
const Menu = ({
  setActive,
  children,
  className,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)}
      className={cn(
        "relative rounded-full border border-transparent gap-x-10 font-bold text-xl    shadow-input flex justify-center space-x-4 px-8 py-6",
        className
      )}
    >
      {children}
    </nav>
  );
};

function Navbar({ className }: { className?: string }) {
  const [active, setActive] = useState<string | null>(null);
  const { theme, setTheme } = useTheme();
  const { userData, logout } = useUser();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      navigate("/");
    }, 3000);
  };
  // Additional logout logic if needed

  return (
    <div
      className={cn("fixed top-10 inset-x-0 max-w-7xl mx-auto z-50", className)}
    >
      <div className="flex justify-between items-center bg-white/30 dark:bg-black/50 backdrop-blur-sm rounded-full border border-black/[0.2] dark:border-white/[0.2] shadow-input px-8 ">
        {/* Logo */}
        <div>
          {/* Dark Mode Logo */}
          <a href="/" className="dark:block hidden">
            <img
              src="/images/logo/logo-white.png"
              alt="Hen and Heaven Logo"
              width={70}
              height={40}
              className="logo-class p-2"
            />
          </a>

          {/* Light Mode Logo */}
          <a href="/" className="dark:hidden block">
            <img
              src="/images/logo/logo-black.png"
              alt="Hen and Heaven Logo"
              width={70}
              height={40}
              className="logo-class p-2"
            />
          </a>
        </div>

        {/* Navigation Items */}
        <Menu setActive={setActive} className="flex-grow flex justify-center">
          <MenuItem setActive={setActive} active={active} item="Home">
            <HoveredLink to="/">Home</HoveredLink>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink to="/franchise">Franchise</HoveredLink>
              <HoveredLink to="/breeding">Breeding</HoveredLink>
              <HoveredLink to="/bulk-orders">Bulk Orders</HoveredLink>
              <HoveredLink to="/sales">Sales</HoveredLink>
            </div>
          </MenuItem>

          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Eggs"
                href="/products"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png"
                description="Fresh eggs from our farm"
              />
              <ProductItem
                title="Chicken"
                href="/products"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/full-chicken-flesh.png"
                description="Fresh chicken from our farm"
              />
              <ProductItem
                title="Hens And Chicks"
                href="/products"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png"
                description="Fresh hens and chicks from our farm can be purchased for farming and business"
              />
              <ProductItem
                title="Bulk Feeds, Eggs and Chickens"
                href="/products"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/10kg-20kg-50kg-chicken-feeds.webp"
                description="Bulk orders for feeds, eggs and chickens are available"
              />
            </div>
          </MenuItem>
        </Menu>

        <div className="flex items-center space-x-4">
          <Link to="/cart">
            <ShoppingCartIcon className="h-6 w-6" size={20} />
          </Link>
          <button
            type="button"
            className="p-2 text-black dark:text-white"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? (
              <Sun className="h-6 w-6" />
            ) : (
              <Moon className="h-6 w-6" />
            )}
          </button>
          {userData ? (
            <div className="relative group">
              {userData.userRole === "admin" ? (
                <Link to="/dashboard">
                  <button className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium dark:text-white text-black-2 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span className="max-w-[100px] truncate">Dashboard</span>
                  </button>
                </Link>
              ) : (
                <button className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium dark:text-white text-black-2 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50">
                  <User className="mr-2 h-4 w-4" />
                  <span className="max-w-[100px] truncate">
                    {userData.fullName}
                  </span>
                </button>
              )}

              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <button className="flex px-4 py-2 text-sm dark:text-white text-black-2 ">
                  <User className="mr-2 h-4 w-4" />
                  {userData.fullName}
                </button>

                <button
                  onClick={handleLogout}
                  className="block px-4 py-2 text-sm dark:text-white text-black-2 "
                >
                  <LogOut className="inline-block mr-2 h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login-register">
              <button className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
