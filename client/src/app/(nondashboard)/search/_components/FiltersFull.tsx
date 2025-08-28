import { FiltersState, initialState, setFilters } from "@/state";
import { useAppSelector } from "@/state/redux";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { debounce } from "lodash";
import { cleanParams, cn, formatEnumString } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { AmenityIcons, PropertyTypeIcons } from "@/lib/constants";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SearchAutocomplete from "@/components/custom/SearchAutocomplete";

function FiltersFull() {
  const reRenderSearch = useRef<number>(0);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(filters);
  const isFiltersFullOpen = useAppSelector(
    (state) => state.global.isFiltersFullOpen,
  );
  useEffect(() => {
    reRenderSearch.current++;
    setLocalFilters(filters);
  }, [filters]);
  const updateURL = useMemo(
    () =>
      debounce((newFilters: FiltersState) => {
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

  const handleSubmit = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
  };

  const handleReset = () => {
    setLocalFilters(initialState.filters);
    dispatch(setFilters(initialState.filters));
    updateURL(initialState.filters);
  };

  const handleAmenityChange = (amenity: AmenityEnum) => {
    setLocalFilters((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleLocationSearch = (payload: {
    location: string;
    coordinates: [number, number];
  }) => {
    setLocalFilters((prev) => ({
      ...prev,
      location: payload.location,
      coordinates: payload.coordinates,
      destroySearch: true,
    }));
  };

  if (!isFiltersFullOpen) return null;

  return (
    <div className="scroll-custom h-full overflow-auto rounded-lg bg-white px-4 pb-10">
      <div className="flex flex-col space-y-6">
        {/* Location */}
        <div>
          <SearchAutocomplete
            key={reRenderSearch.current}
            showLabel={true}
            label="Location"
            defaultValue={localFilters.location}
            placeholder="Search your desired location"
            onValueChange={handleLocationSearch}
            onSearchButtonClick={handleSubmit}
          />
        </div>
        {/* Property Type */}
        <div>
          <h4 className="mb-2 font-bold">Property Type</h4>
          <div className="grid grid-cols-3 gap-4">
            {Object.entries(PropertyTypeIcons).map(([type, Icon]) => (
              <button
                data-filter="property-type"
                key={type}
                className={cn(
                  "flex cursor-pointer flex-col items-center justify-center rounded-xl border p-4 hover:border-orange-400",
                  localFilters.propertyType === type
                    ? "outline-2 outline-orange-500"
                    : "border-gray-200",
                )}
                onClick={() =>
                  setLocalFilters((prev) => ({
                    ...prev,
                    propertyType: type as PropertyTypeEnum,
                  }))
                }
              >
                <Icon className="mb-2 h-6 w-6" />
                <span>{type}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div>
          <h4 className="mb-2 font-bold">Price Range (Monthly)</h4>
          <Slider
            min={0}
            max={10000}
            step={100}
            value={[
              localFilters.priceRange[0] ?? 0,
              localFilters.priceRange[1] ?? 10000,
            ]}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onValueChange={(value: any) =>
              setLocalFilters((prev) => ({
                ...prev,
                priceRange: value as [number, number],
              }))
            }
          />
          <div className="mt-2 flex justify-between">
            <span>${localFilters.priceRange[0] ?? 0}</span>
            <span>${localFilters.priceRange[1] ?? 10000}</span>
          </div>
        </div>

        {/* Beds and Baths */}
        <div className="flex gap-4">
          <div className="flex-1">
            <h4 className="mb-2 font-bold">Beds</h4>
            <Select
              value={localFilters.beds || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, beds: value }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer rounded-xl">
                <SelectValue placeholder="Beds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any beds</SelectItem>
                <SelectItem value="1">1+ bed</SelectItem>
                <SelectItem value="2">2+ beds</SelectItem>
                <SelectItem value="3">3+ beds</SelectItem>
                <SelectItem value="4">4+ beds</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <h4 className="mb-2 font-bold">Baths</h4>
            <Select
              value={localFilters.baths || "any"}
              onValueChange={(value) =>
                setLocalFilters((prev) => ({ ...prev, baths: value }))
              }
            >
              <SelectTrigger className="w-full cursor-pointer rounded-xl">
                <SelectValue placeholder="Baths" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any baths</SelectItem>
                <SelectItem value="1">1+ bath</SelectItem>
                <SelectItem value="2">2+ baths</SelectItem>
                <SelectItem value="3">3+ baths</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Square Feet */}
        <div>
          <h4 className="mb-2 font-bold">Square Feet</h4>
          <Slider
            min={0}
            max={5000}
            step={100}
            value={[
              localFilters.squareFeet[0] ?? 0,
              localFilters.squareFeet[1] ?? 5000,
            ]}
            onValueChange={(value) =>
              setLocalFilters((prev) => ({
                ...prev,
                squareFeet: value as [number, number],
              }))
            }
            className="[&>.bar]:bg-orange-600"
          />
          <div className="mt-2 flex justify-between">
            <span>{localFilters.squareFeet[0] ?? 0} sq ft</span>
            <span>{localFilters.squareFeet[1] ?? 5000} sq ft</span>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <h4 className="mb-2 font-bold">Amenities</h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(AmenityIcons).map(([amenity, Icon]) => (
              <button
                data-filter="amenities-type"
                key={amenity}
                className={cn(
                  "flex items-center space-x-2 rounded-lg border p-2 hover:cursor-pointer hover:border-orange-400",
                  localFilters.amenities.includes(amenity as AmenityEnum)
                    ? "outline-2 outline-orange-500"
                    : "border-gray-200",
                )}
                onClick={() => handleAmenityChange(amenity as AmenityEnum)}
              >
                <Icon className="h-5 w-5 hover:cursor-pointer" />
                <Label className="hover:cursor-pointer">
                  {formatEnumString(amenity)}
                </Label>
              </button>
            ))}
          </div>
        </div>

        {/* Apply and Reset buttons */}
        <div className="mt-6 flex gap-4">
          <Button
            onClick={handleSubmit}
            className="flex-1 cursor-pointer rounded-xl bg-slate-800 text-white hover:bg-orange-600"
          >
            APPLY
          </Button>
          <Button
            onClick={handleReset}
            variant="outline"
            className="flex-1 cursor-pointer rounded-xl"
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FiltersFull;
