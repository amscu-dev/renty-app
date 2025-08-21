import Image from "next/image";
import LandingMainPictore from "../../../public/landing-10.jpg";
import { Card } from "@/components/ui/card";
export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative h-full w-full bg-red-400 p-2">
      <Image src={LandingMainPictore} fill alt="Main Background Picture" />
      <div className="signup-layout h-full rounded-4xl">
        <div className="flex h-full items-center justify-center p-4 sm:p-12">
          <Card className="w-full max-w-[400px] px-8 pt-12 pb-4">
            {children}
          </Card>
        </div>
      </div>
    </div>
  );
}
