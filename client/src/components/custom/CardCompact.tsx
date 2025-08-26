import { Bath, Bed, Heart, House, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const CardCompact = ({
  property,
  isFavorite,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
}: CardCompactProps) => {
  const [imgSrc, setImgSrc] = useState(
    property.photoUrls?.[0] || "/placeholder.jpg",
  );

  return (
    <div className="mb-5 flex h-40 w-full overflow-hidden rounded-xl bg-white shadow-lg">
      <div className="relative w-1/3">
        <Image
          src={imgSrc}
          alt={property.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={() => setImgSrc("/placeholder.jpg")}
        />
        <div className="absolute bottom-2 left-2 flex flex-col gap-1">
          {property.isPetsAllowed && (
            <span className="w-fit rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Pets
            </span>
          )}
          {property.isParkingIncluded && (
            <span className="rounded-full bg-white/80 px-2 py-1 text-xs font-semibold text-black">
              Parking
            </span>
          )}
        </div>
      </div>
      <div className="flex w-2/3 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between">
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
            {showFavoriteButton && (
              <button
                className="rounded-full bg-white p-1"
                onClick={onFavoriteToggle}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"
                  }`}
                />
              </button>
            )}
          </div>
          <p className="mb-1 text-sm text-gray-600">
            {property?.location?.address}, {property?.location?.city}
          </p>
          <div className="flex items-center text-sm">
            <Star className="mr-1 h-3 w-3 text-yellow-400" />
            <span className="font-semibold">
              {property.averageRating.toFixed(1)}
            </span>
            <span className="ml-1 text-gray-600">
              ({property.numberOfReviews})
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-2 text-gray-600">
            <span className="flex items-center">
              <Bed className="mr-1 h-4 w-4" />
              {property.beds}
            </span>
            <span className="flex items-center">
              <Bath className="mr-1 h-4 w-4" />
              {property.baths}
            </span>
            <span className="flex items-center">
              <House className="mr-1 h-4 w-4" />
              {property.squareFeet}
            </span>
          </div>

          <p className="text-base font-bold">
            ${property.pricePerMonth.toFixed(0)}
            <span className="text-xs font-normal text-gray-600"> /mo</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CardCompact;
