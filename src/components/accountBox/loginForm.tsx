"use client";
import React, { useContext, useState } from "react";
import {
  BoldLink,
  BoxContainer,
  HomeLink,
  FormContainer,
  Input,
  LineText,
  MutedLink,
  SubmitButton,
} from "./common";
import { ArrowLeft } from "lucide-react";
import { Marginer } from "../marginer";

import { AccountContext } from "./accountContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";
import { useUser } from "../../hooks/UserContext";
import LottieLoader from "../LottieLoader";
import { useNavigate } from "react-router-dom"; // Import from next/navigation instead of next/router

interface LoginFormProps {}

export const LoginForm: React.FC<LoginFormProps> = () => {
  const { switchToSignup } = useContext(AccountContext);
  const { updateUserData } = useUser();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate(); // Initialize useRouter hook from next/navigation

  const HandleBack: any = async () => {
    navigate("/");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      toast.error("All fields are required.");
      return;
    }

    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setIsLoading(false);
        toast.error("Please verify your email before logging in.");
        return;
      }

      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        toast.error("User data not found. Please contact support.");
        return;
      }

      const userData = userDoc.data();

      if (userData?.status !== "active") {
        setIsLoading(false);
        toast.error("Your account is not active. Please contact support.");
        return;
      }

      const jwtSecretKey =
        process.env.NEXT_PUBLIC_JWT_SECRET_KEY || "default_secret_key";
      const token = jwt.sign(
        {
          uid: user.uid,
          name: userData.fullName,
          email: user.email,
          role: userData?.userRole,
        },
        jwtSecretKey,
        { expiresIn: "1h" }
      );

      sessionStorage.setItem("userToken", token);

      updateUserData({
        ...userData,
        uid: user.uid,
        email: user.email,
      });

      setIsLoading(false);
      toast.success("Login successful!");

      if (userData?.userRole === "admin") {
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        setTimeout(() => {
          navigate("/");
        }, 3000);
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setIsLoading(false);
      toast.error("Login failed. Please check your credentials and try again.");
    }
  };

  return (
    <>
      <BoxContainer>
        <FormContainer onSubmit={handleLogin}>
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
          <Marginer direction="vertical" margin={10} />
          <MutedLink href="#">Forget your password?</MutedLink>
          <Marginer direction="vertical" margin="1.6em" />
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Sign in"}
          </SubmitButton>
        </FormContainer>
        <LineText>
          Don't have an account?{" "}
          <BoldLink onClick={switchToSignup} href="#">
            Signup
          </BoldLink>
          <HomeLink onClick={HandleBack} className="mt-4" href="/">
            <ArrowLeft size={15} className="mr-2" /> Back To Home
          </HomeLink>
        </LineText>
      </BoxContainer>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <LottieLoader
        isLoading={isLoading}
        lottieProps={{ style: { width: 80, height: 80 } }}
      />
    </>
  );
};
