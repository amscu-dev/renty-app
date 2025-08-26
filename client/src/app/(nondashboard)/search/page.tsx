"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { useSearchParams } from "next/navigation";
import FiltersBar from "./_components/FiltersBar";
import FiltersFull from "./_components/FiltersFull";
import { useEffect } from "react";
import { cleanParams } from "@/lib/utils";
import { setFilters } from "@/state";
import Map from "./_components/Map";
import Listings from "./_components/Listings";

function SearchPage() {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen,
  );

  useEffect(() => {
    // searchParams.entries() -- return an iterator, we transform it in an array.
    const initialFilters = Array.from(searchParams.entries()).reduce(
      (acc: any, [key, value]) => {
        if (key === "priceRange" || key === "squareFeet") {
          acc[key] = value.split(",").map((v) => (v === "" ? null : Number(v)));
        } else if (key === "coordinates") {
          acc[key] = value.split(",").map(Number);
        } else {
          acc[key] = value === "any" ? null : value;
        }

        return acc;
      },
      {},
    );
    const cleanedFilters = cleanParams(initialFilters);
    console.log(cleanedFilters);
    dispatch(setFilters(cleanedFilters));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div
      className="mx-auto flex w-full flex-col px-5"
      style={{
        height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
      }}
    >
      <FiltersBar />
      <div className="mb-5 flex flex-1 justify-between gap-3 overflow-hidden">
        <div
          className={`h-full overflow-auto transition-all duration-300 ease-in-out ${
            isFiltersFullOpen
              ? "visible w-3/12 opacity-100"
              : "invisible w-0 opacity-0"
          }`}
        >
          <FiltersFull />
        </div>
        <Map />
        <div className="scroll-custom basis-4/12 overflow-y-auto">
          <Listings />
        </div>
      </div>
    </div>
  );
}

export default SearchPage;
