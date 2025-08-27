import { Skeleton } from "@/components/ui/skeleton";
import { useGetPropertyQuery } from "@/state/api";
import { Compass, MapPin } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

const PropertyLocation = ({ propertyId }: PropertyDetailsProps) => {
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (isLoading || isError || !property) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL as string,
      center: [
        property.location.coordinates.coordinates[0],
        property.location.coordinates.coordinates[1],
      ],
      zoom: 14,
    });

    const marker = new mapboxgl.Marker()
      .setLngLat([
        property.location.coordinates.coordinates[0],
        property.location.coordinates.coordinates[1],
      ])
      .addTo(map);

    const markerElement = marker.getElement();
    const path = markerElement.querySelector("path[fill='#3FB1CE']");
    if (path) path.setAttribute("fill", "#000000");

    return () => map.remove();
  }, [property, isError, isLoading]);

  if (isLoading)
    return (
      <div className="w-full">
        <Skeleton className="mb-[17px] h-[21px] w-[220px] bg-slate-300 shadow-xl" />
        <Skeleton className="mb-[17px] h-[14px] w-full bg-slate-300 shadow-xl" />
        <Skeleton className="mb-[17px] h-[320px] w-full bg-slate-300 shadow-xl" />
      </div>
    );
  if (isError || !property) return;

  return (
    <div className="py-16">
      <h3 className="text-primary-800 dark:text-primary-100 text-xl font-semibold">
        Map and Location
      </h3>
      <div className="text-primary-500 mt-2 flex items-center justify-between text-sm">
        <div className="flex items-center text-gray-500">
          <MapPin className="mr-1 h-4 w-4 text-gray-700" />
          Property Address:
          <span className="ml-2 font-semibold text-gray-700">
            {property.location?.fullAddress || "Address not available"}
          </span>
        </div>
        <a
          href={`https://maps.google.com/?q=${encodeURIComponent(
            property.location?.fullAddress || "",
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-600 flex items-center justify-between gap-2 hover:underline"
        >
          <Compass className="h-5 w-5" />
          Get Directions
        </a>
      </div>
      <div
        className="relative mt-4 h-[300px] overflow-hidden rounded-lg"
        ref={mapContainerRef}
      />
    </div>
  );
};

export default PropertyLocation;
