"use client";
import React, { useState } from "react";
import { LogIn, User, LogOut } from "lucide-react";
import { Sun, Moon } from "lucide-react";
import {
  HoveredLink,
  MenuItem,
  ProductItem,
} from "@/components/ui/navbar-menu";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useUser } from "../hooks/UserContext";
import Link from "next/link";

import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const handleLogout = () => {
    logout();
    setTimeout(() => {
      router.push("/");
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
            <Image
              src="/images/logo/logo-white.png"
              alt="Hen and Heaven Logo"
              width={70}
              height={40}
              priority
              className="logo-class p-2"
            />
          </a>

          {/* Light Mode Logo */}
          <a href="/" className="dark:hidden block">
            <Image
              src="/images/logo/logo-black.png"
              alt="Hen and Heaven Logo"
              width={70}
              height={40}
              priority
              className="logo-class p-2"
            />
          </a>
        </div>

        {/* Navigation Items */}
        <Menu setActive={setActive} className="flex-grow flex justify-center">
          <MenuItem setActive={setActive} active={active} item="Home">
            <HoveredLink href="/">Home</HoveredLink>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Services">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/web-dev">Franchise</HoveredLink>
              <HoveredLink href="/interface-design">Breeding</HoveredLink>
              <HoveredLink href="/seo">Bulk Orders</HoveredLink>
              <HoveredLink href="/branding">Sales</HoveredLink>
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Products">
            <div className="text-sm grid grid-cols-2 gap-10 p-4">
              <ProductItem
                title="Eggs"
                href="/products/eggs"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png"
                description="Fresh eggs from our farm"
              />
              <ProductItem
                title="Chicken"
                href="/products/chicken"
                src="https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/full-chicken-flesh.png"
                description="Fresh chicken from our farm"
              />
              <ProductItem
                title="Moonbeam"
                href="https://gomoonbeam.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.51.31%E2%80%AFPM.png"
                description="Never write from scratch again. Go from idea to blog in minutes."
              />
              <ProductItem
                title="Rogue"
                href="https://userogue.com"
                src="https://assets.aceternity.com/demos/Screenshot+2024-02-21+at+11.47.07%E2%80%AFPM.png"
                description="Respond to government RFPs, RFIs and RFQs 10x faster using AI"
              />
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pricing">
            <div className="flex flex-col space-y-4 text-sm">
              <HoveredLink href="/hobby">Hobby</HoveredLink>
              <HoveredLink href="/individual">Individual</HoveredLink>
              <HoveredLink href="/team">Team</HoveredLink>
              <HoveredLink href="/enterprise">Enterprise</HoveredLink>
            </div>
          </MenuItem>
        </Menu>

        <div className="flex items-center space-x-4">
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
                <Link href="/dashboard">
                  <button className="inline-flex h-10 items-center justify-center rounded-full bg-gradient-to-r from-red-500 to-red-900 px-4 font-medium dark:text-white text-black-2 transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50">
                    <User className="mr-2 h-4 w-4" />
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
              {/* Dropdown menu */}
              <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <button className="flex px-4 py-2 text-sm dark:text-white text-black-2 ">
                  <User className="mr-2 h-4 w-4" />
                  {userData.fullName}
                </button>

                {/* Conditionally render the Dashboard button for admin users */}

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
            <Link href="/login-register">
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
