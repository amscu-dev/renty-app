import {
  FiltersState,
  setFilters,
  setViewMode,
  toggleFiltersFullOpen,
} from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatPriceValue } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Filter, Grid, List, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PropertyTypeIcons } from "@/lib/constants";
import SearchAutocomplete from "@/components/custom/SearchAutocomplete";

function FiltersBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const reRenderSearch = useRef<number>(0);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen,
  );
  const viewMode = useAppSelector((state) => state.global.viewMode);
  useEffect(() => {
    if (filters.destroySearch) {
      reRenderSearch.current++;
    }
  }, [filters]);
  const updateURL = useMemo(
    () =>
      debounce((newFilters: FiltersState) => {
        console.log("hei there this doesnt work");
        const cleanFilters = cleanParams(newFilters);
        const updatedSearchParams = new URLSearchParams();

        Object.entries(cleanFilters).forEach(([key, value]) => {
          updatedSearchParams.set(
            key,
            Array.isArray(value) ? value.join(",") : value.toString(),
          );
        });

        router.push(`${pathname}?${updatedSearchParams.toString()}`);
      }, 1000),
    [pathname, router],
  );

  const handleFilterChange = (
    key: string,
    value: any,
    isMin: boolean | null,
  ) => {
    let newValue = value;

    if (key === "priceRange" || key === "squareFeet") {
      const currentArrayRange = [...filters[key]];
      if (isMin !== null) {
        const index = isMin ? 0 : 1;
        currentArrayRange[index] = value === "any" ? null : Number(value);
      }
      newValue = currentArrayRange;
    } else if (key === "coordinates") {
      newValue = value === "any" ? [0, 0] : value.map(Number);
    } else {
      newValue = value === "any" ? "any" : value;
    }

    const newFilters = { ...filters, [key]: newValue };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };
  const handleLocationSearch = (payload: {
    location: string;
    coordinates: [number, number];
  }) => {
    const newFilters = {
      ...filters,
      destroySearch: false,
      location: payload.location,
      coordinates: payload.coordinates,
    };
    dispatch(setFilters(newFilters));
    updateURL(newFilters);
  };
  return (
    <div className="flex w-full items-center justify-between py-5 font-medium text-slate-800! text-shadow-xs">
      {/* Filters */}
      <div className="flex w-full items-center gap-4 p-2">
        {/* All Filters */}
        <Button
          variant="outline"
          className={cn(
            "border-primary-400 filter-box-shadow cursor-pointer gap-2 rounded-xl hover:text-orange-600",
            isFiltersFullOpen && "text-primary-100 bg-slate-800",
          )}
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <Filter className="h-4 w-4" />
          <span>All Filters</span>
        </Button>

        {/* Search Location */}
        <div className="filter-box-shadow flex w-full max-w-[350px] items-center rounded-l-xl rounded-r-xl">
          <SearchAutocomplete
            key={reRenderSearch.current}
            showLabel={false}
            label="Location"
            defaultValue={filters.location}
            placeholder="Search your desired location"
            onValueChange={handleLocationSearch}
          />
        </div>

        {/* Price Range */}
        <div className="flex gap-1">
          {/* Minimum Price Selector */}
          <Select
            value={filters.priceRange[0]?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange("priceRange", value, true)
            }
          >
            <SelectTrigger className="border-primary-400 hover:filter-box-shadow filter-box-shadow w-36 cursor-pointer rounded-xl">
              <SelectValue>
                {formatPriceValue(filters.priceRange[0], true)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Min Price</SelectItem>
              {[500, 1000, 1500, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  ${price / 1000}k+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Maximum Price Selector */}
          <Select
            value={filters.priceRange[1]?.toString() || "any"}
            onValueChange={(value) =>
              handleFilterChange("priceRange", value, false)
            }
          >
            <SelectTrigger className="border-primary-400 filter-box-shadow w-36 cursor-pointer rounded-xl">
              <SelectValue>
                {formatPriceValue(filters.priceRange[1], false)}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Max Price</SelectItem>
              {[1000, 2000, 3000, 5000, 10000].map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  &lt;${price / 1000}k
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Beds and Baths */}
        <div className="flex gap-1">
          {/* Beds */}
          <Select
            value={filters.beds}
            onValueChange={(value) => handleFilterChange("beds", value, null)}
          >
            <SelectTrigger className="border-primary-400 filter-box-shadow w-36 cursor-pointer rounded-xl">
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Beds</SelectItem>
              <SelectItem value="1">1+ bed</SelectItem>
              <SelectItem value="2">2+ beds</SelectItem>
              <SelectItem value="3">3+ beds</SelectItem>
              <SelectItem value="4">4+ beds</SelectItem>
            </SelectContent>
          </Select>

          {/* Baths */}
          <Select
            value={filters.baths}
            onValueChange={(value) => handleFilterChange("baths", value, null)}
          >
            <SelectTrigger className="border-primary-400 filter-box-shadow w-36 cursor-pointer rounded-xl">
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent className="bg-white">
              <SelectItem value="any">Any Baths</SelectItem>
              <SelectItem value="1">1+ bath</SelectItem>
              <SelectItem value="2">2+ baths</SelectItem>
              <SelectItem value="3">3+ baths</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Type */}
        <Select
          value={filters.propertyType || "any"}
          onValueChange={(value) =>
            handleFilterChange("propertyType", value, null)
          }
        >
          <SelectTrigger className="border-primary-400 filter-box-shadow w-44 cursor-pointer rounded-xl">
            <SelectValue placeholder="Home Type" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            <SelectItem value="any">Any Property Type</SelectItem>
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <SelectItem key={type} value={type}>
                <div className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{type}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* View Mode */}
      <div className="flex items-center justify-between gap-4 p-2">
        <div className="flex rounded-xl border">
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-primary-600 hover:text-primary-50 cursor-pointer rounded-none rounded-l-xl px-3 py-1",
              viewMode === "list" ? "text-primary-50 bg-slate-800" : "",
            )}
            onClick={() => dispatch(setViewMode("list"))}
          >
            <List className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            className={cn(
              "hover:bg-primary-600 hover:text-primary-50 cursor-pointer rounded-none rounded-r-xl px-3 py-1",
              viewMode === "grid" ? "text-primary-50 bg-slate-800" : "",
            )}
            onClick={() => dispatch(setViewMode("grid"))}
          >
            <Grid className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FiltersBar;
