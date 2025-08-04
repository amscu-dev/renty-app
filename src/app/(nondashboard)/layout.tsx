import Navbar from "@/components/custom/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navbar />
      <main className={`h-full flex w-full flex-col pt-[${NAVBAR_HEIGHT}px]`}>
        {children}
      </main>
    </div>
  );
}
