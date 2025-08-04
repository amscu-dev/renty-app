import { NAVBAR_HEIGHT } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import { Button } from "../ui/button";
import AnimatedText from "./AnimatedText";

function Navbar() {
  return (
    <header
      className="fixed top-0 left-0 w-full z-50 shadow-xl"
      style={{ height: `${NAVBAR_HEIGHT}px` }}
    >
      <nav className="flex justify-between items-center w-full py-3 px-8 bg-primary-700 text-white">
        <div className="flex items-center gap-4 md:gap-6 group">
          <Link
            href="/"
            className="cursor-pointer hover:!tex-primary-300"
            scroll={false}
          >
            <div className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Rentiful Logo"
                width={24}
                height={24}
                className="w-6 h-6 group-hover:rotate-180 transform-gpu duration-700 ease-out transition-transform"
              />
              <div className="text-xl font-bold">
                RENT
                <span className="text-secondary-500 font-light group-hover:!text-primary-300">
                  IFUL
                </span>
              </div>
            </div>
          </Link>
        </div>
        <AnimatedText
          className="hidden md:block text-lg font-light"
          text="Rent with confidence: real homes, fair prices, trusted guidance at every step of the way."
          speed={3}
        />
        <div className="flex items-center gap-5">
          <Link href="/signin">
            <Button
              variant="outline"
              className="text-white border-white bg-transparent hover:bg-white hover:text-primary-700 rounded-lg transform-gpu
              transition-colors duration-200 ease-linear cursor-pointer "
            >
              Sign In
            </Button>
          </Link>
          <Link href="/signup">
            <Button
              variant="outline"
              className="text-white border-white bg-secondary-600 hover:bg-white hover:text-primary-700 rounded-lg transform-gpu
              transition-colors duration-200 ease-linear cursor-pointer"
            >
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
