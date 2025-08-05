"use client";

import Image from "next/image";
import { Input } from "@/components/ui/input";
import LandingMainPictore from "./../../../../../public/landing-1.jpg";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

function HeroSection() {
  const [loaded, setLoaded] = useState(false);
  const handleClick = () => {};
  return (
    <div
      className="relative h-full"
      style={{
        backgroundImage: `url(data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wEEEAAQABAAEAAQABEAEAASABQAFAASABoAHAAYABwAGgAmACMAIAAgACMAJgA5ACkALAApACwAKQA5AFcANgA/ADYANgA/ADYAVwBNAF0ASwBGAEsAXQBNAIoAbABgAGAAbACKAJ8AhgB+AIYAnwDBAKwArADBAPMA5wDzAT0BPQGqEQAQABAAEAAQABEAEAASABQAFAASABoAHAAYABwAGgAmACMAIAAgACMAJgA5ACkALAApACwAKQA5AFcANgA/ADYANgA/ADYAVwBNAF0ASwBGAEsAXQBNAIoAbABgAGAAbACKAJ8AhgB+AIYAnwDBAKwArADBAPMA5wDzAT0BPQGq/8IAEQgAIQAyAwEiAAIRAQMRAf/EAC8AAAIDAQAAAAAAAAAAAAAAAAAFAwQGAgEAAwEBAAAAAAAAAAAAAAAAAQIDAAT/2gAMAwEAAhADEAAAAEzqs5eMb5Mw2YQ04iLgrCqDR5NsrtLGQtvDScZyMrozNmNG6CVsThTm6XgUhAaP/8QALBAAAgIBAgQEBQUAAAAAAAAAAQIAAwQRIRITFDEFMlFhUlNxgZEQM0Fjc//aAAgBAQABPwAYjJaBvuDsZg+H2XVk7ebTczHw0ex0qyazwE8fDuAfSY1CY6FVYnU6mExmA/mcwSnJtvuqR2J3Pf6So21q6ppudj6TwxelofWvUu5adT6VmHJb4I+QfSc33aYmnUU/WV6cFkxGVKgG0+86ij+uc2g/LjPT8KfmcVPy1/JmLmgtWOToA27weIOgfgri5uRcyhwy76wOSNgTC5hf3nH7zN/cxv8AOUeSJ2lPl+8ftLO/6f/EABsRAQEAAgMBAAAAAAAAAAAAAAEAAhIQERMx/9oACAECAQE/AIFLW6gWMFvNtGxj5HH/xAAhEQADAAAEBwAAAAAAAAAAAAAAAQIDFCExEBESMkFRYf/aAAgBAwEBPwDwPlL0HR1MdKVqXjqWZmfRmI+GLsV3l7cP/9k=)`,
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
        onLoad={(e) => setLoaded(true)}
        className={`object-cover object-center transition-opacity duration-1000 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
      <div className="absolute inset-0 bg-black/25">
        <div className="animate-main absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="fade-out-hero mx-auto max-w-5xl px-16 sm:px-12">
            <h1 className="mb-4 text-5xl font-extrabold text-white">
              Start your journey to finding the perfect place to call home
            </h1>
            <p className="mb-8 text-xl text-white">
              Explore our wide range of rental properties tailored to fit your
              lifestyle and needs!
            </p>
            <div className="focus-within:p-x-2 flex w-full transform items-center justify-center transition-transform duration-200 ease-out focus-within:scale-120">
              <Input
                type="text"
                // value=""
                // onChange={() => {}}
                placeholder="Search by city, neighborhood or address"
                className="h-12 w-full max-w-lg rounded-full border-none bg-white px-4 font-light"
              />
              <Button
                variant="ghost"
                size="icon"
                className="transform-translate size-[33px] -translate-x-11 rounded-full bg-orange-600 p-0 text-white hover:bg-orange-600/75 hover:text-white active:scale-90"
                onMouseDown={(e) => {
                  console.log(e);
                  e.preventDefault(); // împiedică browser-ul să mute focusul pe buton
                }}
                onClick={() => handleClick()}
              >
                <Search />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;
