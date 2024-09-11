"use client";
import React, { createContext, useState, useContext, useEffect } from "react";

interface UserContextType {
  userData: any;
  updateUserData: (data: any) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userData, setUserData] = useState(() => {
    if (typeof window !== "undefined") {
      const storedData = sessionStorage.getItem("userData");
      return storedData ? JSON.parse(storedData) : null;
    }
    return null; // Server-side fallback
  });

  const updateUserData = (data: any) => {
    setUserData(data);
    if (typeof window !== "undefined") {
      if (data) {
        sessionStorage.setItem("userData", JSON.stringify(data));
      } else {
        sessionStorage.removeItem("userData");
      }
    }
  };

  const logout = () => {
    updateUserData(null);
  };

  useEffect(() => {
    if (typeof window !== "undefined" && userData) {
      sessionStorage.setItem("userData", JSON.stringify(userData));
    }
  }, [userData]);

  return (
    <UserContext.Provider value={{ userData, updateUserData, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
