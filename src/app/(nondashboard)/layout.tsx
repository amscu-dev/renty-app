"use client";

import { NAVBAR_HEIGHT } from "@/lib/constants";

import Navbar from "./landing/_components/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full">
      <Navbar />
      <main
        className={`flex h-full w-full flex-col`}
        style={{ paddingTop: `${NAVBAR_HEIGHT}px` }}
      >
        {children}
      </main>
    </div>
  );
};

export default Layout;
