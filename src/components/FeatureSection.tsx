// FeaturesSectionDemo.tsx
"use client";
import { motion } from "framer-motion";

import { Link } from "react-router-dom";
import { cn } from "../lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { TypewriterEffectSmooth } from "../components/ui/typewriter-effect";
import { Compare } from "../components/ui/compare";

import DotPattern from "../components/magicui/dot-pattern";
const words = [
  {
    text: "About",
  },
  {
    text: "Us",
  },
];
export function FeaturesSection() {
  const features = [
    {
      title: "Track Your orders on poultry products",
      description:
        "In Hen-and Heaven You can easily Buy the products direcyly from Poultry farm with base price and can easily track your order.",
      skeleton: <SkeletonOne />,
      className:
        "col-span-1 lg:col-span-4 border-b lg:border-r dark:border-neutral-800",
    },
    {
      title: "Expolre our Poultry products",
      description:
        "Dive into our HEN AND HEAVEN to explore our poultry products like eggs,chicken meats, feeds and franchises",
      skeleton: <SkeletonTwo />,
      className: "border-b col-span-1 lg:col-span-2 dark:border-neutral-800",
    },
    {
      title: "What it make us different from other",
      description:
        "Why to choose us what we are offering to you and what makes us different from other poultry farms.",
      skeleton: <SkeletonThree />,
      className: "col-span-1 lg:col-span-3 lg:border-r dark:border-neutral-800",
    },
    {
      title: "Delivering the products to your doorsteps worldwide",
      description:
        "We are delivering the products to your doorsteps worldwide with the help of our partners and delivery services.",
      skeleton: <SkeletonFour />,
      className: "col-span-1 lg:col-span-3 border-b lg:border-none",
    },
  ];

  return (
    <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
      <DotPattern
        className={cn(
          "[mask-image:radial-gradient(300px_circle_at_center,white,transparent)] "
        )}
      />

      <div className="px-8">
        <div className="inline-flex justify-center">
          <TypewriterEffectSmooth words={words} />
        </div>
        <p className="text-sm md:text-lg  max-w-2xl font-semibold my-4 mx-auto text-black text-center  dark:text-white">
          At Hen and <span className="text-red-500">Heaven</span>, we are
          committed to revolutionizing poultry farm management by providing an
          innovative and comprehensive Poultry Farm Management System. Our goal
          is to simplify and automate the daily operations of poultry farms,
          allowing farmers to focus on what truly matters ensuring the health
          and welfare of their birds while maximizing efficiency and
          profitability.
        </p>
      </div>
      <div className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-lg dark:border-neutral-800">
          {features.map((feature) => (
            <FeatureCard key={feature.title} className={feature.className}>
              <FeatureTitle>{feature.title}</FeatureTitle>
              <FeatureDescription>{feature.description}</FeatureDescription>
              <div className="h-full w-full">{feature.skeleton}</div>
            </FeatureCard>
          ))}
        </div>
      </div>
    </div>
  );
}

const FeatureCard = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
      {children}
    </div>
  );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
      {children}
    </p>
  );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
  return (
    <p className="text-sm   text-neutral-500 text-center font-normal dark:text-neutral-300  max-w-sm mx-0 md:text-sm my-2">
      {children}
    </p>
  );
};

export const SkeletonOne = () => {
  return (
    <div className="relative flex py-8 px-2 gap-10 h-full">
      <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
          {/* TODO */}
          <img
            src="https://ik.imagekit.io/charanraj/UI/aantarya2%20(1).png"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-left-top rounded-sm"
          />
        </div>
      </div>

      <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
      <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
    </div>
  );
};

export const SkeletonThree = () => {
  return (
    <Link
      to="https://www.youtube.com/watch?v=RPa3_AD1_Vs"
      target="__blank"
      className="relative flex gap-10  h-full group/image"
    >
      <div className="w-full  mx-auto bg-transparent dark:bg-transparent group h-full">
        <div className="flex flex-1 w-full h-full flex-col space-y-2  relative">
          {/* TODO */}
          <div className="p-1 border rounded-3xl dark:bg-neutral-900 bg-neutral-100  border-neutral-200 dark:border-neutral-800 ">
            <Compare
              firstImage="https://assets.aceternity.com/code-problem.png"
              secondImage="https://assets.aceternity.com/code-solution.png"
              firstImageClassName="object-cover object-left-top"
              secondImageClassname="object-cover object-left-top"
              className="h-[250px] w-[200px] md:h-[500px] md:w-full"
              slideMode="hover"
              autoplay={true}
            />
          </div>
          {/*<img
            src="https://assets.aceternity.com/fireship.jpg"
            alt="header"
            width={800}
            height={800}
            className="h-full w-full aspect-square object-cover object-center rounded-sm blur-none group-hover/image:blur-md transition-all duration-200"
          /> */}
        </div>
      </div>
    </Link>
  );
};

export const SkeletonTwo = () => {
  const fistimages = [
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png?updatedAt=1725814559750",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/chicken-legs.png?updatedAt=1725814566982",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/white-hens.png?updatedAt=1725814579413",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/white-eggs.png?updatedAt=1725814577080",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
  ];
  const secondimages = [
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/chicken-legs.png?updatedAt=1725814566982",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/white-hens.png?updatedAt=1725814579413",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/white-eggs.png?updatedAt=1725814577080",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png?updatedAt=1725814559750",
  ];
  const thirdimages = [
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-hen.png?updatedAt=1725814572287",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs-tray.png?updatedAt=1725814566869",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png?updatedAt=1725814559750",
  ];
  const fourthimages = [
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png?updatedAt=1725814559750",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/white-eggs.png?updatedAt=1725814577080",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/hen-and-chicks.png?updatedAt=1725814567210",
    "https://ik.imagekit.io/charanraj/Poultry/Products%20Poultry-Hen%20and%20heaven/brown-eggs.png?updatedAt=1725814559750",
  ];

  const imageVariants = {
    whileHover: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
    whileTap: {
      scale: 1.1,
      rotate: 0,
      zIndex: 100,
    },
  };
  return (
    <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden">
      {/* TODO */}
      <div className="flex flex-row -ml-20">
        {fistimages.map((image, idx) => (
          <motion.div
            variants={imageVariants}
            key={"images-first" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {secondimages.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row -ml-20">
        {thirdimages.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>
      <div className="flex flex-row">
        {fourthimages.map((image, idx) => (
          <motion.div
            key={"images-second" + idx}
            style={{
              rotate: Math.random() * 20 - 10,
            }}
            variants={imageVariants}
            whileHover="whileHover"
            whileTap="whileTap"
            className="rounded-xl -mr-4 mt-4 p-1 bg-white dark:bg-neutral-800 dark:border-neutral-700 border border-neutral-100 flex-shrink-0 overflow-hidden"
          >
            <img
              src={image}
              alt="bali images"
              width="500"
              height="500"
              className="rounded-lg h-20 w-20 md:h-40 md:w-40 object-cover flex-shrink-0"
            />
          </motion.div>
        ))}
      </div>

      <div className="absolute left-0 z-[100] inset-y-0 w-20 bg-gradient-to-r from-white dark:from-black to-transparent  h-full pointer-events-none" />
      <div className="absolute right-0 z-[100] inset-y-0 w-20 bg-gradient-to-l from-white dark:from-black  to-transparent h-full pointer-events-none" />
    </div>
  );
};

export const SkeletonFour = () => {
  return (
    <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
      <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
    </div>
  );
};

export const Globe = ({ className }: { className?: string }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let phi = 0;

    if (!canvasRef.current) return;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: 600 * 2,
      height: 600 * 2,
      phi: 0,
      theta: 0,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.3, 0.3, 0.3],
      markerColor: [0.1, 0.8, 1],
      glowColor: [1, 1, 1],
      markers: [
        // longitude latitude
        { location: [37.7595, -122.4367], size: 0.03 },
        { location: [40.7128, -74.006], size: 0.1 },
      ],
      onRender: (state) => {
        // Called on every animation frame.
        // `state` will be an empty object, return updated params.
        state.phi = phi;
        phi += 0.01;
      },
    });

    return () => {
      globe.destroy();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
      className={className}
    />
  );
};
