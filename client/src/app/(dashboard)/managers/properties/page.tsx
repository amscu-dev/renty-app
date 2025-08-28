"use client";

import Card from "@/components/custom/Card";
import DashboardPagesHeader from "@/components/custom/DashboardPagesHeader";
import DashboardPropertySkeletonCard from "@/components/custom/DashboardPropertySkeletonCard";
import NoData from "@/components/custom/NoData";
import { useGetAuthUserQuery, useGetManagerPropertiesQuery } from "@/state/api";
import React from "react";

function ManagerPropertiesPage() {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: managerProperties,
    isLoading: isLoadingManagerData,
    error,
  } = useGetManagerPropertiesQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  if (isLoadingManagerData)
    return (
      <div className="dashboard-container">
        <DashboardPagesHeader
          title="Current Residences"
          subtitle="View and manage your current living spaces."
        />
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
          <DashboardPropertySkeletonCard />
        </div>
      </div>
    );
  if (error)
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
        {managerProperties?.map((property) => (
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
      {(!managerProperties || managerProperties.length === 0) && (
        <NoData
          message="You don&lsquo;t have any properties under management. Please feel free to post your first residence."
          containerClassName="mt-48"
        />
      )}
    </div>
  );
}

export default ManagerPropertiesPage;
