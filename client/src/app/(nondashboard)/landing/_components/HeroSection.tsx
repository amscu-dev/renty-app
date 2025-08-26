"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import LandingMainPictore from "./../../../../../public/landing-5.jpg";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { FiltersState, setFilters, switchSearchVisible } from "@/state";
import SearchAutocomplete from "@/components/custom/SearchAutocomplete";
import { useRouter } from "next/navigation";
import { debounce } from "lodash";
import { cleanParams } from "@/lib/utils";
import { HERO_PLACEHOLDER_BG } from "@/lib/constants";

const HeroSection = () => {
  const router = useRouter();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(filters);
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const dispatch = useAppDispatch();
  const [loaded, setLoaded] = useState(false);
  const updateURL = (newFilters: FiltersState) => {
    const cleanFilters = cleanParams(newFilters);
    const updatedSearchParams = new URLSearchParams();

    Object.entries(cleanFilters).forEach(([key, value]) => {
      updatedSearchParams.set(
        key,
        Array.isArray(value) ? value.join(",") : value.toString(),
      );
    });

    router.push(`search?${updatedSearchParams.toString()}`);
  };

  useEffect(() => {
    dispatch(switchSearchVisible({ isNavbarSearchVisible: !inView }));
  }, [inView, dispatch]);

  const handleClickSearch = () => {
    dispatch(setFilters(localFilters));
    updateURL(localFilters);
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
  return (
    <div
      className={`hero-image-animation relative h-screen -translate-y-15`}
      style={{
        backgroundImage: `${HERO_PLACEHOLDER_BG}`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Image
        src={LandingMainPictore}
        alt="Some text"
        fill
        priority={true}
        sizes="(max-width: 420px) 480px,(max-width: 1200px) 828px, 1080px"
        onLoad={() => setLoaded(true)}
        className={`object-cover object-center transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"} `}
      />

      <div className="absolute inset-0 bg-black/25">
        <div
          className="animate-main absolute top-1/2 left-1/2 w-full max-w-5xl -translate-x-1/2 -translate-y-1/2 text-center"
          ref={ref}
        >
          <div className="fade-out-hero px-16 sm:px-12">
            <h1 className="mb-12 text-3xl font-extrabold text-white sm:text-3xl md:text-5xl 2xl:text-6xl">
              Start your journey to finding the perfect place to call{" "}
              <span className="text-orange-600">home</span>
            </h1>

            <p className="mb-8 text-xs text-white sm:text-sm md:text-xl">
              Explore our wide range of rental properties tailored to fit your
              lifestyle and needs!
            </p>

            <SearchAutocomplete
              showLabel={false}
              defaultValue={""}
              placeholder="Search your desired location"
              onSearchButtonClick={handleClickSearch}
              onValueChange={handleLocationSearch}
              containerClassName="w-full max-w-lg bg-white rounded-full mx-auto"
              inputClassName="rounded-full h-12"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
