import { NAVBAR_HEIGHT } from "@/lib/constants";

import Navbar from "../../components/custom/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
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
