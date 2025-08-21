"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import { usePathname, useRouter } from "next/navigation";
import Navbar from "@/components/custom/Navbar";
import AppSidebar from "@/components/custom/AppSidebar";
import DashboardLayoutSkeleton from "../../components/custom/DashboardLayoutSkeleton";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);
  const router = useRouter();
  // if (true) return <DashboardLayoutSkeleton />;
  if (!authUser?.userRole) return null;

  return (
    <div className="relative h-full">
      <DashboardLayoutSkeleton isLoading={loading} />
      <SidebarProvider>
        <div className="bg-primary-100 min-h-screen w-full px-7">
          <Navbar />
          <div className="mt-[75px]">
            <main className="flex">
              <AppSidebar userType={authUser.userRole.toLowerCase()} />
              <div className="flex-grow transition-all duration-300">
                {children}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
