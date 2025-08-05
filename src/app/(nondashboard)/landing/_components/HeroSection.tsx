"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Image
        src="/landing-splash.jpg"
        alt="Rentiful Rental Platform Hero Section"
        fill
        className="object-cover object-center"
        priority
      />
      <div className="absolute inset-0 bg-black/25"></div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-1/3 w-full -translate-x-1/2 -translate-y-1/2 transform text-center"
      >
        <div className="mx-auto max-w-4xl px-16 sm:px-12">
          <h1 className="mb-4 text-5xl font-bold text-white">
            Start your journey to finding the perfect place to call home
          </h1>
          <p className="mb-8 text-xl text-white">
            Explore our wide range of rental properties tailored to fit your
            lifestyle and needs!
          </p>

          <div className="flex justify-center">
            <Input
              type="text"
              placeholder="Search by city, neighborhood or address"
              className="h-12 w-full max-w-lg rounded-none rounded-l-xl border-none bg-white"
            />
            <Button className="bg-secondary-500 hover:bg-secondary-600 h-12 rounded-none rounded-r-xl border-none text-white">
              Search
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HeroSection;
