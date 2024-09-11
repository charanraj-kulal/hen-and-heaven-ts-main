import React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, LogIn } from "lucide-react";
import Link from "next/link";
import { useUser } from "../hooks/UserContext";
const ModeToggle = () => {
  const { theme, setTheme } = useTheme();
  const { userData } = useUser();

  return (
    <button
      type="button"
      className="px-2 text-black dark:text-white mr-3"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      <Sun className="h-7 w-7 dark:hidden" />
      <Moon className="hidden h-7 w-7 dark:block" />
    </button>
  );
};

const LoginButton = () => (
  <Link href={"/login-register"}>
    <button className="inline-flex h-12 w-24 md:w-full gap-2 animate-shimmer items-center justify-center rounded-full border border-white bg-[linear-gradient(110deg,#df1c1f,45%,#1e2631,55%,#df1c1f)] bg-[length:200%_100%] px-6 font-medium text-white transition-colors focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2 focus:ring-offset-slate-50">
      <LogIn />
      Login
    </button>
  </Link>
);

const DarkModeToggleWithLogin = () => {
  return (
    <div className="inline-flex justify-center items-center p-4  transition-colors duration-200">
      <div className=" items-center justify-between ">
        <ModeToggle />
      </div>
      <LoginButton />
    </div>
  );
};

export default DarkModeToggleWithLogin;
