"use client";
import AnimatedText from "@/components/custom/AnimatedText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useAppSelector } from "@/state/redux";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  const isNavbarSearchVisible = useAppSelector(
    (state) => state.global.isNavbarSearchVisible,
  );
  return (
    <header
      className="fixed top-[5px] left-1/2 z-50 w-29/30 -translate-x-1/2 rounded-full border-b-[0.5px] border-orange-900 shadow-xl"
      // style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <nav className="nav-blur flex w-full items-center justify-between gap-4 rounded-full px-9 py-3 text-white">
        <div className="group mr-2 flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="hover:!text-primary-300 cursor-pointer"
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
                  IFUL
                </span>
              </div>
            </div>
          </Link>
        </div>
        {!isNavbarSearchVisible && (
          <AnimatedText
            className="font-light sm:text-[11px] sm:font-normal lg:text-lg"
            text="Rent with confidence: real homes with trusted guidance at every step of the way."
            speed={3}
          />
        )}
        {isNavbarSearchVisible && (
          <div
            className={`flex items-center justify-center ${isNavbarSearchVisible && "search-navbar"} relative hidden sm:flex sm:w-xs md:w-md lg:w-2xl`}
          >
            <Input
              type="text"
              // value=""

              // onChange={() => {}}

              placeholder="Search by city, neighborhood or address"
              className="w-full rounded-full border-none bg-white px-4 font-light sm:text-sm lg:text-base"
            />

            <Button
              variant="ghost"
              size="icon"
              className="transform-translate absolute right-1 size-8 rounded-full bg-orange-600 p-0 text-white hover:bg-orange-600/75 hover:text-white active:scale-90"
            >
              <Search />
            </Button>
          </div>
        )}
        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="hover:text-primary-700 transform-gpu cursor-pointer rounded-lg border-white bg-transparent text-white transition-colors duration-200 ease-linear hover:bg-white"
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="secondary"
              className="hover:text-primary-700 transform-gpu cursor-pointer rounded-lg border-white bg-orange-600 text-white transition-colors duration-200 ease-linear hover:bg-white"
            >
              Sign Up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
