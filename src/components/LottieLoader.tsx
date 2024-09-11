import React from "react";
import Lottie, { LottieComponentProps } from "lottie-react";
import loaderAnimation from "../assets/animations/loader.json";

interface LottieLoaderProps {
  isLoading: boolean;
  message?: string;
  lottieProps?: Partial<LottieComponentProps>;
}

const LottieLoader: React.FC<LottieLoaderProps> = ({
  isLoading,
  message,
  lottieProps,
}) => {
  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backdropFilter: "blur(3px)",
        backgroundColor: "rgba(0,0,30,0.4)",
        zIndex: 9999,
      }}
    >
      <Lottie
        animationData={loaderAnimation}
        loop={true}
        style={{ width: 100, height: 100 }}
        {...lottieProps}
      />
      {message && (
        <p style={{ color: "white", marginTop: "1rem", textAlign: "center" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LottieLoader;
