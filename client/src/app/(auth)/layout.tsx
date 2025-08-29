import Image from "next/image";
import { PixelImage } from "@/components/custom/PixelImage";
import LandingMainPictore from "../../../public/landing-10.jpg";
import { Card } from "@/components/ui/card";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-slate-900 p-2">
      {/* <Image
        src={LandingMainPictore}
        fill
        alt="Main Background Picture"
        className="object-cover"
      /> */}
      {/* Stanga Jos */}
      <PixelImage
        src="./auth-4.jpg"
        grid="8x8"
        containerClassName="w-160 top-[50%] right-[57%] aspect-video rounded-xl ring-6 ring-blue-600 ring-offset-6 ring-offset-white z-40 shadow-2xl"
      />
      <PixelImage
        src="./auth-5.jpg"
        grid="8x8"
        containerClassName="w-160 top-[7%] right-[10%] aspect-video ring-6 ring-cyan-600 ring-offset-6 ring-offset-white z-40 shadow-2xl"
      />
      <PixelImage
        src="./auth-3.jpg"
        grid="8x8"
        containerClassName="w-160 -top-[25%] right-[30%] aspect-video ring-6 ring-purple-600 ring-offset-6 ring-offset-white z-20 shadow-2xl"
      />
      <PixelImage
        src="./auth-1.jpg"
        grid="8x8"
        containerClassName="w-100 aspect-3/4 top-[11%] left-[17%] ring-6 ring-lime-600 ring-offset-6 ring-offset-white z-20 shadow-2xl"
      />
      <PixelImage
        src="./auth-2.jpg"
        grid="8x8"
        containerClassName="w-110 aspect-3/4 bottom-[8%] right-[13%] ring-6 ring-teal-600 ring-offset-6 ring-offset-white z-30 shadow-2xl"
      />
      <PixelImage
        src="./auth-6.jpg"
        grid="8x8"
        containerClassName="w-100 aspect-video -bottom-[5%] right-[35%] ring-6 ring-fuchsia-600 ring-offset-6 ring-offset-white z-40 shadow-2xl"
      />

      <div className="flex h-full items-center justify-center p-4 sm:p-12">
        <Card className="z-50 w-full max-w-[400px] px-8 pt-12 pb-4">
          {children}
        </Card>
      </div>
    </div>
  );
}
