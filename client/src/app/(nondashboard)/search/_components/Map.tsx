"use client";

import React, { CSSProperties, useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { cn } from "@/lib/utils";
import NoData from "@/components/custom/NoData";
import { MAP_PLACEHOLDER_BG } from "@/lib/constants";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

function Map() {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isMapUpdating, setIsMapUpdating] = useState(false);

  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isFetching,
    isError,
  } = useGetPropertiesQuery(filters);

  // 1) Init map - o singură dată
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: process.env.NEXT_PUBLIC_MAPBOX_STYLE_URL as string,
      center: (filters.coordinates as [number, number]) ?? [-74.5, 40],
      zoom: 9,
    });

    map.on("load", () => setIsMapReady(true));
    mapRef.current = map;

    // resize după mount
    const t = setTimeout(() => map.resize(), 700);

    return () => {
      clearTimeout(t);
      // curățăm marker-ele și harta
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) Mută centrul fără să recreezi harta
  useEffect(() => {
    if (!isMapReady || !mapRef.current) return;
    if (filters.coordinates) {
      mapRef.current.easeTo({
        center: filters.coordinates as [number, number],
        duration: 500,
      });
    }
  }, [isMapReady, filters.coordinates]);

  // 3) Actualizează marker-ele când avem proprietăți noi
  useEffect(() => {
    if (!isMapReady || isLoading || isError || !properties || !mapRef.current)
      return;

    setIsMapUpdating(true);

    // ștergem marker-ele anterioare
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // adăugăm marker-ele noi
    properties.data.forEach((property: IProperty) => {
      const marker = createPropertyMarker(property, mapRef.current!);

      // exemplul tău de schimbare a culorii
      const el = marker.getElement();
      const path = el.querySelector("path[fill='#3FB1CE']");
      if (path) path.setAttribute("fill", "#000000");

      markersRef.current.push(marker);
    });

    setIsMapUpdating(false);
  }, [isMapReady, isLoading, isFetching, isError, properties]);

  if (isError) return <NoData message="Failed to fetch properties" />;

  return (
    <div
      className={cn(
        "relative grow basis-5/12 overflow-hidden rounded-3xl",
        !isMapReady || isLoading || isFetching || isMapUpdating
          ? "pointer-events-none cursor-progress"
          : "",
      )}
    >
      <div
        className="map-container relative transform-gpu"
        ref={mapContainerRef}
        style={{ height: "100%", width: "100%" }}
      />
      {/* Overlay loader peste hartă */}
      {(!isMapReady || isLoading || isFetching || isMapUpdating) && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 flex items-center justify-center rounded-3xl blur-sm",
            isMapReady
              ? `bg-white/30`
              : `bg-[url("data:image/jpeg;base64,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")] bg-cover`,
          )}
        ></div>
      )}
      {(!isMapReady || isLoading || isFetching || isMapUpdating) && (
        <div className="absolute top-1/2 left-1/2 h-10 w-10 animate-spin rounded-full border-4 border-slate-500 border-t-transparent" />
      )}
    </div>
  );
}

const createPropertyMarker = (property: IProperty, map: mapboxgl.Map) => {
  const [lng, lat] = property.location.coordinates.coordinates as [
    number,
    number,
  ];
  const imgUrl = property.photoUrls[0];
  const marker = new mapboxgl.Marker()
    .setLngLat([lng, lat])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
         
          <img src="${imgUrl}" class="marker-popup-image" alt="" />
          
          <div>
            <a href="/search/${property._id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `,
      ),
    )
    .addTo(map);

  return marker;
};

export default Map;
