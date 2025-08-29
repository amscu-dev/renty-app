import { Suspense } from "react";
import SearchPage from "./_components/SearchPage";
import DashboardLayoutSkeleton from "@/components/custom/DashboardLayoutSkeleton";

function Page() {
  return (
    <Suspense
      fallback={
        <DashboardLayoutSkeleton
          isLoading={true}
          message="Searching best properties for you"
        />
      }
    >
      <SearchPage />;
    </Suspense>
  );
}

export default Page;
