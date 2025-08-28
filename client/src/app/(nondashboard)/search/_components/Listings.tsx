import Card from "@/components/custom/Card";
import CardCompact from "@/components/custom/CardCompact";
import CardSkeleton from "@/components/custom/CardSkeleton";
import NoData from "@/components/custom/NoData";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthTenant } from "@/hooks/useAuthType";
import {
  useAddFavoritePropertyMutation,
  useGetPropertiesQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";
import { useAppSelector } from "@/state/redux";

import React from "react";
import { toast } from "sonner";

const Listings = () => {
  const { data: authTentant } = useAuthTenant();
  const { data: tenant, isLoading: isLoadingTenant } = useGetTenantQuery(
    authTentant?.userInfo.data.cognitoId || "",
    {
      skip: !authTentant?.cognitoInfo?.userId,
    },
  );
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();
  const viewMode = useAppSelector((state) => state.global.viewMode);
  const filters = useAppSelector((state) => state.global.filters);

  const {
    data: properties,
    isLoading: isLoadingProperties,
    isFetching: isFetchingProperties,
    isError,
  } = useGetPropertiesQuery(filters);

  const handleFavoriteToggle = async (propertyId: string) => {
    if (!authTentant) toast.info("Please sign in to perform this action!");
    if (!authTentant) return;

    const isFavorite = tenant?.favorites?.some(
      (fav: IProperty) => fav._id === propertyId,
    );

    if (isFavorite) {
      await removeFavorite({
        cognitoId: authTentant.cognitoInfo.userId,
        propertyId,
      });
    } else {
      await addFavorite({
        cognitoId: authTentant.cognitoInfo.userId,
        propertyId,
      });
    }
  };

  if (isLoadingProperties || isFetchingProperties)
    return (
      <div className="flex w-full flex-col gap-5 pr-2">
        <Skeleton className="h-[20px] w-4/10 rounded-xl bg-slate-300" />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>
    );
  if (isError || !properties)
    return <NoData message="Failed to fetch properties" />;

  if (properties.data.length === 0)
    return <NoData message="No properties found." />;

  return (
    <div className="w-full">
      <h3 className="px-4 text-sm font-bold">
        {properties.data.length}{" "}
        <span className="font-normal text-gray-700">
          Places in {filters.location}
        </span>
      </h3>
      <div className="flex">
        <div className="w-full p-4">
          {properties.data.map((property) =>
            viewMode === "grid" ? (
              <Card
                key={property._id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: IProperty) => fav._id === property._id,
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property._id)}
                showFavoriteButton={!!authTentant}
                propertyLink={`/search/${property._id}`}
              />
            ) : (
              <CardCompact
                key={property._id}
                property={property}
                isFavorite={
                  tenant?.favorites?.some(
                    (fav: IProperty) => fav._id === property._id,
                  ) || false
                }
                onFavoriteToggle={() => handleFavoriteToggle(property._id)}
                showFavoriteButton={!!authTentant}
                propertyLink={`/search/${property._id}`}
              />
            ),
          )}
        </div>
      </div>
    </div>
  );
};

export default Listings;
