// components/withAuth.tsx
"use client";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext"; // assuming this hook gives you userData

const withAuth = (WrappedComponent: any) => {
  return (props: any) => {
    const { userData } = useUser();
    const router = useNavigate();

    useEffect(() => {
      // Check if user is not an admin, redirect to login page
      if (!userData || userData.userRole !== "admin") {
        router("/login-register");
      }
    }, [userData, router]);

    // If no userData or the user is not admin, don't render the protected page
    if (!userData || userData.userRole !== "admin") {
      return null; // Render nothing while redirecting
    }

    // If the user is an admin, render the protected page
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
