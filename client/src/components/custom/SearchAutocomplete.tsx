import React, { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { useClickAway, useDebounce } from "@uidotdev/usehooks";
import { RotatingLines } from "react-loader-spinner";
import { Button } from "../ui/button";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SearchAutocompleteProps {
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  showLabel?: boolean;
  label?: string;
  defaultValue?: string;
  placeholder?: string;
  onSearchButtonClick?: () => void;
  onValueChange?: (payload: {
    location: string;
    coordinates: [number, number];
  }) => void;
}
interface SearchLocationType {
  id: number;
  name: string;
  postcodes: string;
  country: string;
  feature_code: string;
  country_code: string;
  admin1: string;
  admin2: string;
  admin3: string;
  latitude: number;
  longitude: number;
}
interface GeocodeResponseApi {
  results?: SearchLocationType[];
  generationtime_ms: number;
}

interface SearchTerm {
  value: string;
  isSettled: boolean;
}

function SearchAutocomplete({
  showLabel = false,
  label = "Location",
  defaultValue = "",
  placeholder = "",
  onValueChange,
  onSearchButtonClick,
  containerClassName,
  inputClassName,
  buttonClassName,
}: SearchAutocompleteProps) {
  const [searchTerm, setSearchTerm] = useState<SearchTerm>({
    value: defaultValue,
    isSettled: true,
  });
  const isDisabled = searchTerm.value === "" || !searchTerm.isSettled;
  const [activeId, setActiveId] = useState<number>(NaN);
  const [activeOptionsId, setActiveOptionsId] = useState<number>(NaN);
  const [results, setResults] = useState<SearchLocationType[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isInitialMounted, setInitialMounted] = useState<boolean>(true);
  const [error, setError] = useState(null);
  const [resultsBox, setResultsBox] = useState<boolean>(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const suppressNextFocusRef = useRef(false);
  const containerRef = useClickAway<HTMLDivElement>(() => {
    setIsSearching(false);
    setResultsBox(false);
    if (searchTerm.value === "")
      setSearchTerm({
        value: defaultValue,
        isSettled: true,
      });
    setActiveId(NaN);
  });
  const inputRef = useRef<HTMLInputElement | null>(null);
  const resultsContainer = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setSearchTerm({
      value: defaultValue,
      isSettled: true,
    });
  }, [defaultValue]);

  useEffect(() => {
    // La First Render nimic
    if (isInitialMounted) return;
    const params = new URLSearchParams({
      name: debouncedSearchTerm.value.toLowerCase().trim(),
      count: "10",
      language: "en",
    });
    const url = `https://geocoding-api.open-meteo.com/v1/search?${params.toString()}`;
    const searchLocation = async () => {
      if (!debouncedSearchTerm.value && !debouncedSearchTerm.isSettled) {
        setIsSearching(true);
        return;
      }
      if (debouncedSearchTerm.isSettled) return;
      setIsSearching(true);
      setResultsBox(true);
      const response = await fetch(url);
      const data = (await response.json()) as GeocodeResponseApi;
      setResults(Array.isArray(data.results) ? data.results : []);
      setIsSearching(false);
    };
    searchLocation();
  }, [debouncedSearchTerm, isInitialMounted]);

  useEffect(() => {
    if (activeOptionsId && resultsBox) {
      document
        .querySelector<HTMLElement>(`[data-id="${activeOptionsId}"]`)
        ?.scrollIntoView({ block: "nearest" });
    }
  }, [activeOptionsId, resultsBox]);

  const handleUpdateValue = (opt: SearchLocationType, id: number) => {
    setSearchTerm({
      value: opt.name,
      isSettled: true,
    });
    setResultsBox(false);
    setActiveOptionsId(id);
    setActiveId(id);
    if (onValueChange) {
      onValueChange({
        location: opt.name,
        coordinates: [opt.longitude, opt.latitude],
      });
    }
    suppressNextFocusRef.current = true;
    inputRef.current?.focus();
  };

  const handleContainerKeyboardActions = (
    e: React.KeyboardEvent<HTMLDivElement>,
  ) => {
    if (
      e.key === "ArrowDown" ||
      e.key === "ArrowUp" ||
      e.key === "PageDown" ||
      e.key === "PageUp"
    ) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.key === "ArrowDown") {
      const isResults = results.length > 0;
      if (!isResults) return;

      if (isResults) {
        setResultsBox(true);
        if (!activeId && activeId !== 0) {
          requestAnimationFrame(() => {
            resultsContainer.current?.focus();
          });

          setActiveId(0);
          return;
        }
        if (activeId >= 0) {
          const lastItem = activeId === results.length - 1;
          if (lastItem) return;
          if (!lastItem) {
            let nextItemId = activeOptionsId;
            requestAnimationFrame(() => {
              resultsContainer.current?.focus();
              document
                .querySelector<HTMLElement>(`[data-id="${nextItemId}"]`)
                ?.scrollIntoView({ block: "nearest" });
            });

            if (resultsBox) {
              nextItemId = activeId + 1;
              setActiveId((p) => p + 1);
            }
            document
              .querySelector<HTMLElement>(`[data-id="${nextItemId}"]`)
              ?.scrollIntoView({ block: "nearest" });
          }
          return;
        }
      }
    }
    if (e.key === "ArrowUp") {
      const isResults = results.length > 0;
      if (!isResults) return;
      if (isResults && resultsBox) {
        const firstItem = activeId === 0;
        if (firstItem) return;
        if (!firstItem) {
          const prevItemId = activeId - 1;
          document
            .querySelector<HTMLElement>(`[data-id="${prevItemId}"]`)
            ?.scrollIntoView({ block: "nearest" });
          setActiveId((p) => p - 1);
        }
      }
    }
    if (e.key === "Escape") {
      suppressNextFocusRef.current = true;
      setResultsBox(false);
      setActiveId(activeOptionsId);
      inputRef.current?.focus();
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (resultsBox && activeId >= 0) {
        handleUpdateValue(results[activeId], activeId);
      }
    }
  };
  const handleSearchButton = () => {
    if (isDisabled) return;
    if (searchTerm.value === "") return;
    if (onSearchButtonClick) {
      onSearchButtonClick();
    }
  };
  return (
    <div className={cn("w-full", containerClassName)}>
      {showLabel && <h4 className="mb-2 font-bold">{label}</h4>}
      <div
        className="relative h-full"
        ref={containerRef}
        onKeyDown={handleContainerKeyboardActions}
      >
        <Input
          ref={inputRef}
          value={searchTerm.value}
          placeholder={placeholder}
          className={cn("w-full rounded-xl pr-12 pl-8", inputClassName)}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setInitialMounted(false);
            setActiveId(NaN);
            setActiveOptionsId(NaN);
            setSearchTerm({ value: e.target.value, isSettled: false });
            setResultsBox(true);
          }}
          role="combobox"
          aria-expanded={resultsBox}
          aria-controls="autocomplete-listbox"
          aria-autocomplete="list"
          autoComplete="off"
          onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
            if (suppressNextFocusRef.current) {
              suppressNextFocusRef.current = false; // consumă flag-ul
              return; // NU deschide dropdown-ul pentru focus programatic
            }

            if (results.length) setResultsBox(true); // focus de la user (click/Tab)
          }}
        />
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={handleSearchButton}
              aria-disabled={isDisabled}
              className={cn(
                "hover:text-primary-50 absolute top-1/2 right-1 h-3/4 -translate-y-1/2 cursor-pointer rounded-full border bg-orange-600 shadow-none hover:bg-orange-500 active:bg-orange-300",
                isDisabled
                  ? "cursor-not-allowed bg-orange-300 hover:bg-orange-300"
                  : "",
                buttonClassName,
              )}
            >
              <Search className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {searchTerm.value === "" || !searchTerm.isSettled
                ? "Please select a valid location"
                : "Show properties"}
            </p>
          </TooltipContent>
        </Tooltip>

        {isSearching && (
          <span className="absolute top-1/2 left-[5px] -translate-y-1/2">
            <RotatingLines
              visible={true}
              width="16"
              strokeWidth="5"
              strokeColor="oklch(20.8% 0.042 265.755)"
              animationDuration="0.9"
            />
          </span>
        )}
        {resultsBox && (
          <div
            className="absolute z-50 mt-1 h-fit max-h-48 w-full overflow-y-auto overscroll-y-contain rounded-md border border-slate-200 bg-white px-1 py-2 shadow-md"
            ref={resultsContainer}
            tabIndex={0}
          >
            <ul id="autocomplete-listbox" role="listbox">
              {isSearching && (
                <li className="flex items-center justify-center py-1">
                  <RotatingLines
                    visible={true}
                    width="24"
                    strokeWidth="5"
                    strokeColor="oklch(20.8% 0.042 265.755)"
                    animationDuration="0.9"
                  />
                </li>
              )}
              {!isSearching && error && (
                <li className="px-3 py-2 text-sm text-red-600">{error}</li>
              )}
              {!isSearching && !error && results.length === 0 && (
                <li className="px-3 py-2 text-sm text-slate-500">
                  Please input a corect location.
                </li>
              )}
              {!isSearching &&
                !error &&
                results.map((opt, id) => (
                  <li
                    key={opt.id}
                    data-id={id}
                    role="option"
                    aria-selected={id === activeId}
                    onClick={() => handleUpdateValue(opt, id)}
                    className={cn(
                      "mb-0.5 cursor-pointer rounded-md px-3 py-1 text-[14px] text-slate-800 hover:bg-slate-200",
                      id === activeId || id === activeOptionsId
                        ? "bg-slate-200"
                        : "",
                    )}
                  >
                    {id === activeOptionsId && <span className="mr-1">✔️</span>}
                    <span className="font-medium">{opt.name}, </span>
                    <span className="text-[12px] text-slate-600">
                      {opt.admin1},{" "}
                    </span>
                    <span className="text-[12px] text-slate-600">
                      {opt.country}
                    </span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchAutocomplete;
