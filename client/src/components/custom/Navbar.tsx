"use client";
import AnimatedText from "@/components/custom/AnimatedText";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cleanParams, cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { RotatingLines } from "react-loader-spinner";
import SearchAutocomplete from "./SearchAutocomplete";
import { useState } from "react";
import { FiltersState, setFilters } from "@/state";

function Navbar() {
  const isNavbarSearchVisible = useAppSelector(
    (state) => state.global.isNavbarSearchVisible,
  );
  const router = useRouter();
  const filters = useAppSelector((state) => state.global.filters);
  const [localFilters, setLocalFilters] = useState(filters);
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");
  const isSearchPage = pathname.includes("/search");
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

  const handleSignOut = async () => {
    await signOut();
    // Next.js, router.push("/") (din useRouter) nu face un refresh complet al paginii, ci o navigare client-side (SPA navigation).
    // Starea aplicației din memorie (inclusiv store, cache, variabile React) nu se resetează complet.
    // Navigare rapidă, păstrând starea → folosești router.push("/").
    // Reset complet al aplicației (ștergere store în memorie, reîncărcare scripts, styles, etc.) → folosești:
    window.location.href = "/";
  };
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
    <header className="fixed top-[5px] left-0 z-30 w-full px-7">
      <nav
        className={cn(
          "flex h-[58px] w-full items-center justify-between gap-4 rounded-full border-b-[0.5px] border-orange-900 px-9 py-3 text-white shadow-xl",
          isDashboardPage || isSearchPage ? "bg-slate-900" : "nav-blur",
        )}
      >
        <div className="mr-2 flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />{" "}
            </div>
          )}
          <Link
            href="/"
            className="hover:!text-primary-300 group duration- transform-gpu cursor-pointer rounded-lg p-1 transition-all"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="h-6 w-6 transform-gpu transition-transform duration-700 ease-out group-hover:rotate-180"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 group-hover:!text-primary-300 font-light">
                  EASE
                </span>
              </div>
            </div>
          </Link>
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="bg-secondary-500 text-primary-50 hover:bg-primary-50 hover:text-primary-700 transform-gpu cursor-pointer transition-colors duration-300 md:ml-4"
              onClick={() => {
                router.push(
                  authUser.userRole?.toLowerCase() === "manager"
                    ? "/managers/newproperty"
                    : "/search",
                );
              }}
            >
              {authUser.userRole?.toLowerCase() === "manager" ? (
                <>
                  <Plus className="h-4 w-4" />
                  <span className="ml-2 hidden md:block">Add New Property</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  <span className="ml-2 hidden md:block">
                    Search Properties
                  </span>
                </>
              )}
            </Button>
          )}
        </div>
        {!isNavbarSearchVisible && !isDashboardPage && (
          <AnimatedText
            className="font-light sm:text-[11px] sm:font-normal lg:text-lg"
            text="Rent with confidence: real homes with trusted guidance at every step of the way."
            speed={3}
          />
        )}
        {isNavbarSearchVisible && !isDashboardPage && !isSearchPage && (
          <SearchAutocomplete
            showLabel={false}
            defaultValue={""}
            placeholder="Search your desired location"
            onSearchButtonClick={handleClickSearch}
            onValueChange={handleLocationSearch}
            containerClassName={`${isNavbarSearchVisible && "search-navbar"} hidden sm:block sm:w-xs md:w-md lg:w-2xl bg-white rounded-full`}
            inputClassName="rounded-full text-slate-800"
          />
        )}
        {authLoading ? (
          <RotatingLines
            visible={true}
            width="24"
            strokeWidth="5"
            strokeColor="white"
            animationDuration="0.75"
          />
        ) : (
          <div className="erorr-animation flex items-center gap-5">
            {authUser ? (
              // AVATAR
              <>
                <div className="relative hidden md:block">
                  <MessageCircle className="text-primary-200 hover:text-primary-400 h-6 w-6 cursor-pointer" />
                  <span className="bg-secondary-700 absolute top-0 right-0 h-2 w-2 rounded-full"></span>
                </div>
                <div className="relative hidden md:block">
                  <Bell className="text-primary-200 hover:text-primary-400 h-6 w-6 cursor-pointer" />
                  <span className="bg-secondary-700 absolute top-0 right-0 h-2 w-2 rounded-full"></span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 rounded-full focus:outline-none">
                    <Avatar>
                      {/* <AvatarImage src={authUser.userInfo?.image} /> */}
                      <AvatarFallback className="border-2 border-white bg-orange-600">
                        {authUser.userRole?.[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {/* <p className="text-primary-200 hidden md:block">
                    {authUser.userInfo.data?.name}
                  </p> */}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    className="text-primary-700 bg-white"
                    align="end"
                  >
                    <DropdownMenuItem
                      className="hover:!bg-primary-700 hover:!text-primary-100 cursor-pointer font-bold"
                      onClick={() =>
                        router.push(
                          authUser.userRole?.toLowerCase() === "manager"
                            ? "/managers/properties"
                            : "/tenants/favorites",
                          { scroll: false },
                        )
                      }
                    >
                      Go to Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-primary-200" />
                    <DropdownMenuItem
                      className="hover:!bg-primary-700 hover:!text-primary-100 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/${authUser.userRole?.toLowerCase()}s/settings`,
                          { scroll: false },
                        )
                      }
                    >
                      Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="hover:!bg-primary-700 hover:!text-primary-100 cursor-pointer"
                      onClick={handleSignOut}
                    >
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              // AUTH BUTTON
              <>
                <Link href="/signin" tabIndex={-1}>
                  <Button
                    variant="outline"
                    className="hover:text-primary-700 transform-gpu cursor-pointer rounded-lg border-white bg-transparent text-white transition-all duration-150 ease-linear hover:bg-white"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup" tabIndex={-1}>
                  <Button
                    variant="secondary"
                    className="hover:text-primary-700 transform-gpu cursor-pointer rounded-lg border-white bg-orange-600 text-white transition-all duration-150 ease-linear hover:bg-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
