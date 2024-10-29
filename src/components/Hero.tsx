"use client";
import { useState, useRef, useEffect } from "react";
import BlurIn from "../components/magicui/blur-in";
import BlurFade from "../components/magicui/blur-fade";
import { Volume2, VolumeX } from "lucide-react";
import { useTheme } from "next-themes";
import { Highlight } from "../components/ui/hero-highlight";
const BLUR_FADE_DELAY = 0.1;

const Hero = () => {
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setTheme } = useTheme();
  useEffect(() => {
    // Ensure dark mode is set on initial load
    setTheme("dark");
  }, []);
  // Toggle mute/unmute when the button is clicked
  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Detect when the hero section is in view
  // Detect when the hero section is out of view and mute the video
  useEffect(() => {
    const handleScroll = () => {
      const heroSection = document.getElementById("hero");
      const rect = heroSection?.getBoundingClientRect();
      const isOutOfView =
        rect && (rect.top < 0 || rect.bottom > window.innerHeight);

      if (videoRef.current && isOutOfView) {
        videoRef.current.muted = true;
        setIsMuted(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <section id="hero" className="relative h-screen text-white">
      {/* Background Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        playsInline
      >
        {/* Use the direct path to the video in the public directory */}
        <source src="/videos/poultry_video.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Black Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b dark:from-black-2/70 dark:to-black-2 from-white/5 to-white"></div>

      {/* Hero Content */}
      <div className="relative z-10 container mx-auto h-full flex flex-col justify-center items-center text-center">
        <BlurIn
          word=" Welcome to Hen and Heaven!!"
          className="text-4xl font-bold dark:text-white text-black-2 text-shadow:_0_1px_0_rgb(0_0_0_/_40%)]
             transition-all duration-500 ease-in-out 
             "
        />

        <BlurFade delay={BLUR_FADE_DELAY}>
          <p className="mt-4 text-lg md:text-xl dark:text-white text-black-2">
            Hatching SUCCESS and BOLD DREAMS.
            <br />
            Best in the insudtry
            <br />
            <Highlight className="dark:text-white text-blacke">
              EGGS & FRESH MEATS
            </Highlight>
          </p>

          {/* Mute/Unmute Button */}

          <button
            onClick={toggleMute}
            className="mt-4 bg-black-2 dark:bg-white dark:text-black-2 text-white px-4 py-2 rounded-full"
          >
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
        </BlurFade>
      </div>
    </section>
  );
};

export default Hero;
