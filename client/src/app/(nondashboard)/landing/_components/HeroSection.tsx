"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import LandingMainPictore from "./../../../../../public/landing-5.jpg";
import { useInView } from "react-intersection-observer";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { FiltersState, setFilters, switchSearchVisible } from "@/state";
import SearchAutocomplete from "@/components/custom/SearchAutocomplete";
import { useRouter } from "next/navigation";
import { cleanParams } from "@/lib/utils";

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
        backgroundImage: `url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAf/CABEIABEAGQMBEQACEQEDEQH/xAAwAAEAAwEAAAAAAAAAAAAAAAAIBQcJCgEAAgMBAQAAAAAAAAAAAAAABAgCBgcFA//aAAwDAQACEAMQAAAAr9btKQBVw0sz9cZ0scGtSJDePJMdFgUsv4nSq1OnZdlq2xA6kXZi/wD/xAAtEAACAgIBAQYDCQAAAAAAAAAEBQMGAgcBEwAICRUWtRB21hg0ODlVWHSTl//aAAgBAQABPwDbGy94ernV1j9LZqQLCnrLJK2e2o59kc+scqXONON6SljLUrT5uIosM3AxUQIkOAq+WXmEbPQne52+4uyXVE2u49qLC52qYCUI4OaKuNSq+cMXgV6nLRxcLYlIRGJA8sJuWMIsMIpgRA4sckHiPXvm7LM1mxTzOFRCsGUDB4JnUcMFnXXWNdMOklMxDiXOieBRsS4OWcy5bFLyonwkI6v2+rj+4dB/Tf8A6C7Urw39G7119ZN2Jbvg3p7/AGNFZLMxrplou3JJeN9lsRIEas9DQwKijZs48Q2zeS3Nx4evK75iiBxlzjNO0noLZPmlA0Fhrq8HtogOVHFyOBsFpZBpmVbgOhrvAl/M4M5Xn5i4M5m0a3CaIaPozTSdefY3dzXVzWDdnqN5u6Hc3qeQwHWF8w1izSkiPzpFz/PC5HCrRVKbgQMw6IfFEuPOKL45KNjlMwOw8i8SX9Huv+ma0+o+3hV/lY7B+Vdse0tuzP8AGnr35Lrnts3bvF/dU38gD21d8P/EADIRAAICAQEDBREAAAAAAAAAAAIDAQQFEgAGEQcTFyHVEBUjNDVBQlJUcXOEkpOxs8L/2gAIAQIBAT8Aw+Gt4/IbwThN5scq1ds2cjZxGdxjAWTRVJPhF+m1TXLQpEwcMrSaxiJZJEUxNHEZ+lfRdx9LF1IWLrLqlPItbisg9tQ6MPBDK1U8c4EWTEGBzoa5RDUyASUbwcr97CXaVhF7MsaizFO3Ut1yp4hbAc9bVEakv59SxUzRbQUqgRCWiemQLpB3/wDUH7t/sTZFJE+EbRFVx1Y16zVC3Eti5AJk44zMkk54jIAURMrKeMaobiRdAAqHSCVaAEAFdevpKC49YkMapHr4QMHw83XMb28m1LeCotDkUylFnvgEzWNEOsgOqIdNZqhsLJoazRYI6rWSLrCGsAdHRVvL7a36w7Q2yHlEPl/52HxVvxw/SnYfR9xfmO5//8QAMxEAAgIBAQUFAw0AAAAAAAAAAgMBBAURAAYTFCIHEiEjMhAzNDZUVnN0gZKUsbPB0+L/2gAIAQMBAT8Af2s7kbyOxOAz+FyAWMNXjFKy2Fy6hJi6rGCUlQyKzSDDkDbMjaFRdQxIQA6Oz+6t7EORYzGTyDD5dFK3dxYBlKVVdpeQ4PNVX3VZNJ2K6WEprKxyqHEmzMyK5vXZ47LMWQNbbb46SmQgoa2DEoj0xEwXq10gfGNubn52v8TP6tg3arVc0zLhc5mDsvc1YQJpOX699cQydIWJl4a6wcRroIGQDe7UMdhH8ueOKr50qPnWDWsNZER5akL4jCiB04ceMgJRpBDIxDt+d0c5W5UDHEW2th8i2IITMTNcSyU9cC2eqJKRAyGJ0hndLbQ/pJW/Mf72qfC/cf6bdqny+pfYEfztmPeVfrFfsh7P/9k=)`,
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
