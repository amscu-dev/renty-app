"use client";

import { SidebarProvider } from "@/components/ui/sidebar";
import React, { useEffect, useState } from "react";
import { useGetAuthUserQuery } from "@/state/api";
import Navbar from "@/components/custom/Navbar";
import AppSidebar from "@/components/custom/AppSidebar";
import DashboardLayoutSkeleton from "../../components/custom/DashboardLayoutSkeleton";
import { signOut } from "aws-amplify/auth";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading: authLoading } = useGetAuthUserQuery();

  useEffect(() => {
    if (!authLoading && !authUser) {
      (async () => {
        try {
          await signOut();
        } finally {
          window.location.href = "/";
        }
      })();
    }
  }, [authLoading, authUser]);

  if (authLoading) return <DashboardLayoutSkeleton isLoading={authLoading} />;
  if (!authUser) return <>Signing out…</>;

  return (
    <div className="relative h-full">
      <DashboardLayoutSkeleton isLoading={authLoading} />;
      <SidebarProvider>
        <div className="bg-primary-100 min-h-screen w-full px-7">
          <Navbar />
          <div className="mt-[75px]">
            <main className="flex">
              <AppSidebar userType={authUser.userRole} />
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
