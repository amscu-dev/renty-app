import Image from "next/image";
import Link from "next/link";
import { Button } from "../../../../components/ui/button";
import AnimatedText from "../../../../components/custom/AnimatedText";

function Navbar() {
  return (
    <header className="fixed top-[5px] left-1/2 z-50 w-29/30 -translate-x-1/2 rounded-full border-b-[0.5px] border-orange-900 shadow-xl">
      <nav className="nav-blur flex w-full items-center justify-between rounded-full px-9 py-3 text-white">
        <div className="group flex items-center gap-4 md:gap-6">
          <Link
            href="/"
            className="hover:!tex-primary-300 cursor-pointer"
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
        <AnimatedText
          className="font-semibold sm:text-[11px] sm:font-normal lg:text-lg"
          text="Rent with confidence: real homes, fair prices, trusted guidance at every step of the way."
          speed={3}
        />
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
              Sign up
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
