import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const Card = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg",
  );

  return (
    <div className="mb-5 w-full overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="relative">
        <div className="relative h-48 w-full">
          <Image
            src={imgSrc}
            alt={property.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
        </div>
        <div className="absolute bottom-4 left-4 flex gap-2">
          {property.isPetsAllowed && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Pets Allowed
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Parking Included
            </span>
          )}
        </div>
        {showFavoriteButton && (
          <button
            className="absolute right-4 bottom-4 cursor-pointer rounded-full bg-white p-2 hover:bg-white/90"
            onClick={onFavoriteToggle}
          >
            <Heart
              className={`h-5 w-5 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
              }`}
            />
          </button>
        )}
      </div>
      <div className="p-4">
        <h2 className="mb-1 text-xl font-bold">
          {propertyLink ? (
            <Link
              href={propertyLink}
              className="hover:text-blue-600 hover:underline"
              scroll={false}
            >
              {property.name}
            </Link>
          ) : (
            property.name
          )}
        </h2>
        <p className="mb-2 text-gray-600">
          {property?.location?.address}, {property?.location?.city}
        </p>
        <div className="flex items-center justify-between">
          <div className="mb-2 flex items-center">
            <Star className="mr-1 h-4 w-4 text-yellow-400" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-600">
              ({property.numberOfReviews} Reviews)
            </span>
          </div>
          <p className="mb-3 text-lg font-bold">
            ${property.pricePerMonth.toFixed(0)}{" "}
            <span className="text-base font-normal text-gray-600"> /month</span>
          </p>
        </div>
        <hr />
        <div className="mt-5 flex items-center justify-between gap-4 text-gray-600">
          <span className="flex items-center">
            <Bed className="mr-2 h-5 w-5" />
            {property.beds} Bed
          </span>
          <span className="flex items-center">
            <Bath className="mr-2 h-5 w-5" />
            {property.baths} Bath
          </span>
          <span className="flex items-center">
            <House className="mr-2 h-5 w-5" />
            {property.squareFeet} sq ft
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
