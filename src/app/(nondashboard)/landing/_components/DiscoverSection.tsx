"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const DiscoverSection = () => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.8 }}
      variants={containerVariants}
      className="mb-16 bg-white py-12"
    >
      <div className="mx-auto max-w-6xl px-6 sm:px-8 lg:px-12 xl:max-w-7xl xl:px-16">
        <motion.div variants={itemVariants} className="my-12 text-center">
          <h2 className="text-3xl leading-tight font-semibold text-gray-800">
            Discover
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            From studio to family home, uncover rentals tailored to you today.
          </p>
          <p className="mx-auto mt-2 max-w-3xl text-gray-500">
            Discover your next rental effortlessly: refine by price, location,
            amenities, and dates; compare shortlisted homes side-by-side, see
            availability, schedule viewings instantly, and apply
            securely—everything in one place so you spend less time searching
            and more time settling in comfortably today.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 gap-8 text-center md:grid-cols-3 lg:gap-12 xl:gap-16">
          {[
            {
              imageSrc: "/landing-icon-wand.png",
              title: "Discover Local Listings",
              description:
                "Explore verified rentals near you with powerful filters and real-time details.",
            },
            {
              imageSrc: "/landing-icon-calendar.png",
              title: "Schedule and Secure",
              description:
                "Pick viewing times, reserve your place, and complete paperwork entirely online.",
            },
            {
              imageSrc: "/landing-icon-heart.png",
              title: "Settle In Happily",
              description:
                "Move in smoothly with helpful checklists and neighborhood tips tailored to you.",
            },
          ].map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <DiscoverCard {...card} />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const DiscoverCard = ({
  imageSrc,
  title,
  description,
}: {
  imageSrc: string;
  title: string;
  description: string;
}) => (
  <div className="bg-primary-50 rounded-lg px-4 py-12 shadow-lg md:h-72">
    <div className="bg-primary-700 mx-auto mb-4 h-10 w-10 rounded-full p-[0.6rem]">
      <Image
        src={imageSrc}
        width={30}
        height={30}
        className="h-full w-full"
        alt={title}
      />
    </div>
    <h3 className="mt-4 text-xl font-medium text-gray-800">{title}</h3>
    <p className="mt-2 text-base text-gray-500">{description}</p>
  </div>
);

export default DiscoverSection;
