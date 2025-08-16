"use client";
import { NAVBAR_HEIGHT } from "@/lib/constants";

import Navbar from "../../components/custom/Navbar";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authUser) {
      const userRole = authUser.userRole?.toLowerCase();
      if (
        (userRole === "manager" && pathname.startsWith("/search")) ||
        (userRole === "manager" && pathname.startsWith("/"))
      ) {
        // redirectul din layout catre unde am nevoie sa merg
        router.push("/managers/properties", { scroll: false });
      } else {
        setIsLoading(false);
      }
    }
    console.log(authUser);
  }, [authUser, router, pathname]);

  // if (authLoading || isLoading) return <>Loading...</>;

  return (
    <div className="h-full w-full overflow-y-auto">
      <Navbar />
      <main className={`w-full`} style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
