"use client";
import { motion } from "framer-motion";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

function FeaturesSection() {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      variants={containerVariants}
      className="bg-white px-6 py-24 sm:px-8 lg:px-12 xl:px-16"
    >
      <div className="mx-auto max-w-4xl xl:max-w-6xl">
        <motion.h2
          variants={itemVariants}
          className="font-bolt mx-auto mb-12 w-full text-center text-3xl sm:w-2/3"
        >
          Effortlessly locate homes you love using advanced, customizable
          filters.
        </motion.h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[0, 1, 2].map((index) => (
            <motion.div key={index} variants={itemVariants}>
              <FeatureCard
                imgSrc={`/landing-search${3 - index}.png`}
                title={
                  [
                    "Curated and Secure Rental Listings",
                    "Effortless  Home-Finding Journey",
                    "Hyper-Targeted  Search Filters",
                  ][index]
                }
                description={
                  [
                    "Find only authenticated properties vetted by our expert verification team.",
                    "Navigate listings seamlessly with intuitive controls and lightning-fast response.",
                    "Filter results precisely by budget, location, amenities and availability date.",
                  ][index]
                }
                linkText={["Explore", "Search", "Discover"][index]}
                linkHref={["/explore", "/search", "/discover"][index]}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const FeatureCard = ({
  imgSrc,
  title,
  description,
  linkText,
  linkHref,
}: {
  imgSrc: string;
  title: string;
  description: string;
  linkText: string;
  linkHref: string;
}) => {
  return (
    <div className="text-center">
      <div
        className="mb-4 flex h-48 items-center justify-center rounded-lg bg-contain bg-center bg-no-repeat p-4"
        style={{ backgroundImage: `url(${imgSrc})` }}
      >
        {/* <Image
          src={imgSrc}
          width={400}
          height={400}
          className="h-full w-full object-contain"
          alt={title}
        /> */}
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="mb-4">{description}</p>
      <Link
        href={linkHref}
        className="rouded inline-block border border-gray-300 px-4 py-2 hover:bg-gray-100"
        scroll={false}
      >
        {linkText}
      </Link>
    </div>
  );
};

export default FeaturesSection;
