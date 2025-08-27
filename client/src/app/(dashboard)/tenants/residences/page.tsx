"use client";

import Card from "@/components/custom/Card";
import DashboardPagesHeader from "@/components/custom/DashboardPagesHeader";
import DashboardPropertySkeletonCard from "@/components/custom/DashboardPropertySkeletonCard";
import NoData from "@/components/custom/NoData";
import {
  useGetAuthUserQuery,
  useGetCurrentResidencesQuery,
  useGetTenantQuery,
} from "@/state/api";
import React from "react";

function TenantResidencesPage() {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: tenant,
    isLoading: isLoadingTenantData,
    error: tenantError,
  } = useGetTenantQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  const {
    data: currentResidences,
    isLoading: isLoadingCurrentResidences,
    error: errorResidence,
  } = useGetCurrentResidencesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  if (isLoadingTenantData || isLoadingCurrentResidences)
    return (
      <div className="dashboard-container">
        <DashboardPagesHeader
          title="Favorited Properties"
          subtitle="Browse and manage your saved property listings"
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
        </div>
      </div>
    );
  if (tenantError || errorResidence)
    return (
      <NoData message="There was an error loading your favorites properties." />
    );

  return (
    <div className="dashboard-container">
      <DashboardPagesHeader
        title="Favorited Properties"
        subtitle="Browse and manage your saved property listings"
      />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {currentResidences?.map((property) => (
          <Card
            key={property._id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/search/${property._id}`}
          />
        ))}
      </div>
      {(!currentResidences || currentResidences.length === 0) && (
        <NoData message="You don&lsquo;t have any residences. Please feel free to start your journey now!" />
      )}
    </div>
  );
}

export default TenantResidencesPage;
