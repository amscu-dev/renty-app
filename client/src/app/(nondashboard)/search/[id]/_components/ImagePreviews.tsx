"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertyQuery } from "@/state/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

const ImagePreviews = ({ propertyId }: ImagePreviewsProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const FallbackImages = ["/singlelisting-2.jpg", "/singlelisting-3.jpg"];
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  if (isLoading)
    return (
      <div className="mt-6 rounded-4xl px-8">
        <Skeleton className="mb-[17px] h-[450px] w-full rounded-4xl bg-slate-300 shadow-xl" />
      </div>
    );

  if (isError || !property) return;

  const photos =
    property.photoUrls.length === 0 ? FallbackImages : property.photoUrls;

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative mx-auto mt-6 h-[450px] w-[calc(100%_-_3.5rem)] rounded-4xl shadow-md shadow-orange-300">
      {photos.map((image, index) => (
        <div
          key={image}
          className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
            index === currentImageIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={image}
            alt={`Property Image ${index + 1}`}
            fill
            priority={index == 0}
            className="rounded-4xl object-cover transition-transform duration-500 ease-in-out"
          />
        </div>
      ))}
      <button
        onClick={handlePrev}
        className="bg-primary-700 bg-opacity-50 focus:ring-secondary-300 absolute top-1/2 left-[20px] -translate-y-1/2 transform cursor-pointer rounded-full p-2 focus:ring focus:outline-none"
        aria-label="Previous image"
      >
        <ChevronLeft className="text-white" />
      </button>
      <button
        onClick={handleNext}
        className="bg-primary-700 bg-opacity-50 focus:ring-secondary-300 absolute top-1/2 right-[20px] -translate-y-1/2 transform cursor-pointer rounded-full p-2 focus:ring focus:outline-none"
        aria-label="Previous image"
      >
        <ChevronRight className="text-white" />
      </button>
    </div>
  );
};

export default ImagePreviews;
