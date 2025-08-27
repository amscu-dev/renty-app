"use client";

import Card from "@/components/custom/Card";
import DashboardPagesHeader from "@/components/custom/DashboardPagesHeader";
import DashboardPropertySkeletonCard from "@/components/custom/DashboardPropertySkeletonCard";
import NoData from "@/components/custom/NoData";

import { useGetAuthUserQuery, useGetTenantQuery } from "@/state/api";
import React from "react";

function TenantFavoritesPage() {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: tenant,
    isLoading: isLoadingTenantData,
    error,
  } = useGetTenantQuery(authUser?.cognitoInfo?.userId || "", {
    skip: !authUser?.cognitoInfo?.userId,
  });
  if (isLoadingTenantData)
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
        {tenant?.favorites?.map((property) => (
          <Card
            key={property._id}
            property={property}
            isFavorite={true}
            onFavoriteToggle={() => {}}
            showFavoriteButton={false}
            propertyLink={`/tenants/residences/${property._id}`}
          />
        ))}
      </div>
      {(!tenant?.favorites || tenant?.favorites.length === 0) && (
        <NoData message="You don&lsquo;t have any favorited properties" />
      )}
    </div>
  );
}

export default TenantFavoritesPage;
