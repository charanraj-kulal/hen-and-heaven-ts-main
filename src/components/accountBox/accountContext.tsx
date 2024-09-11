import { createContext } from "react";

// Define the shape of the context value
type AccountContextType = {
  switchToSignup: () => void;
  switchToSignin: () => void;
};

// Create the context with an initial default value
export const AccountContext = createContext<AccountContextType>({
  switchToSignup: () => {},
  switchToSignin: () => {},
});
