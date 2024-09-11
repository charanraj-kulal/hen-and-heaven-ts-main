// About.tsx
"use client";
// import { motion } from "framer-motion";
// import { HeroHighlight } from "../components/ui/hero-highlight";

import { FeaturesSection } from "./FeatureSection";

export default function About() {
  return (
    <>
      <section
        id="about"
        className=" bg-white dark:bg-black-2 text-center justify-center px-24"
      >
        <div>
          <FeaturesSection />
        </div>
      </section>
    </>
  );
}
