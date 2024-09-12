import { useState, useEffect } from "react";

const useColorMode = () => {
  // Default to "light" if colorMode from localStorage is null
  const [colorMode, setColorMode] = useState<string>(
    typeof window !== "undefined" && window.localStorage.getItem("color-mode")
      ? (window.localStorage.getItem("color-mode") as string)
      : "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = colorMode === "dark";

    root.classList.remove(isDark ? "light" : "dark");
    root.classList.add(isDark ? "dark" : "light");

    if (typeof window !== "undefined") {
      window.localStorage.setItem("color-mode", colorMode);
    }
  }, [colorMode]);

  return [colorMode, setColorMode] as const;
};

export default useColorMode;
