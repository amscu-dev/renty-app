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
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useGetAuthUserQuery } from "@/state/api";
import { useAppSelector } from "@/state/redux";
import { signOut } from "aws-amplify/auth";
import { Bell, MessageCircle, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

function Navbar() {
  const isNavbarSearchVisible = useAppSelector(
    (state) => state.global.isNavbarSearchVisible,
  );
  const { data: authUser } = useGetAuthUserQuery();
  console.log(authUser);
  const router = useRouter();
  const pathname = usePathname();
  const isDashboardPage =
    pathname.includes("/managers") || pathname.includes("/tenants");
  const handleSignOut = async () => {
    await signOut();
    // Next.js, router.push("/") (din useRouter) nu face un refresh complet al paginii, ci o navigare client-side (SPA navigation).
    // Starea aplicației din memorie (inclusiv store, cache, variabile React) nu se resetează complet.
    // Navigare rapidă, păstrând starea → folosești router.push("/").
    // Reset complet al aplicației (ștergere store în memorie, reîncărcare scripts, styles, etc.) → folosești:
    window.location.href = "/";
  };
  return (
    <header className="fixed top-[5px] left-0 z-50 w-full px-7">
      <nav
        className={cn(
          "flex h-[58px] w-full items-center justify-between gap-4 rounded-full border-b-[0.5px] border-orange-900 px-9 py-3 text-white shadow-xl",
          isDashboardPage ? "bg-slate-900" : "nav-blur",
        )}
      >
        <div className="group mr-2 flex items-center gap-4 md:gap-6">
          {isDashboardPage && (
            <div className="md:hidden">
              <SidebarTrigger />{" "}
            </div>
          )}
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
          {isDashboardPage && authUser && (
            <Button
              variant="secondary"
              className="bg-rpimary-50 text-primary-700 hover hover:bg-secondary-500 hover:text-primary-50 md:ml-4"
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
        {isNavbarSearchVisible && !isDashboardPage && (
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
          {authUser ? (
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
                <DropdownMenuTrigger className="flex cursor-pointer items-center gap-2 focus:outline-none">
                  <Avatar>
                    <AvatarImage src={authUser.userInfo?.image} />
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
            <>
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
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
