import React, { useContext, useState } from "react";
import {
  BoldLink,
  BoxContainer,
  FormContainer,
  Input,
  HomeLink,
  LineText,
  SubmitButton,
} from "./common";
import { Marginer } from "../marginer";
import { AccountContext } from "./accountContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, db } from "../../../firebase"; // Firebase config
import { doc, setDoc } from "firebase/firestore"; // Firestore methods
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth"; // Firebase Auth methods
import LottieLoader from "../LottieLoader";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
export const SignupForm: React.FC = () => {
  const { switchToSignin } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
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

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return passwordRegex.test(password);
  };
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if all fields are filled
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error("All fields are required.");
      return;
    }

    // Check email format
    if (!validateEmail(formData.email)) {
      toast.error("Please enter a valid email.");
      return;
    }

    // Check password strength
    if (!validatePassword(formData.password)) {
      toast.error(
        "Password must be at least 8 characters long and include one special character."
      );
      return;
    }

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      // Create user in Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Send verification email
      await sendEmailVerification(user);

      // Store user data in Firestore using the user's UID as the document ID
      await setDoc(doc(db, "users", user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        isVerified: false,
        userRole: "user",
        status: "active",
        profileUrl: "null",
        createdAt: new Date(),
      });
      setIsLoading(false);
      toast.success("Signup successful! Please verify your email.");
    } catch (error) {
      console.error("Error signing up:", error);
      setIsLoading(false);
      toast.error("Signup failed. Please try again.");
    }
  };

  return (
    <>
      <BoxContainer>
        <FormContainer onSubmit={handleSignup}>
          <Input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData.fullName}
            onChange={handleChange}
          />
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
          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          <Marginer direction="vertical" margin={10} />
          <SubmitButton type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Sign up"}
          </SubmitButton>
        </FormContainer>
        <Marginer direction="vertical" margin="5px" />
        <LineText>
          Already have an account?{" "}
          <BoldLink onClick={switchToSignin} href="#">
            Signin
          </BoldLink>
          <HomeLink onClick={HandleBack} className="mt-1" href="/">
            <ArrowLeft size={15} className="mr-2" /> Back To Home
          </HomeLink>
        </LineText>
      </BoxContainer>

      {/* Toast container for displaying messages */}
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
