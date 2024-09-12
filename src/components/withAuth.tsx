import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../hooks/UserContext";

const withAuth = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const WithAuth: React.FC<P> = (props) => {
    const { userData } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
      if (!userData || userData.userRole !== "admin") {
        navigate("/login-register");
      }
    }, [userData, navigate]);

    if (!userData || userData.userRole !== "admin") {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default withAuth;
