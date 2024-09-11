import { useState, useEffect } from "react";

const useColorMode = () => {
  const [colorMode, setColorMode] = useState(
    typeof window !== "undefined" && window.localStorage.getItem("color-mode")
      ? window.localStorage.getItem("color-mode")
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
