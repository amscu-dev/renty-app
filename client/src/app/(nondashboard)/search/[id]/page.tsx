"use client";

import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import { useParams } from "next/navigation";
import React, { useState } from "react";
import ImagePreviews from "./_components/ImagePreviews";
import PropertyOverview from "./_components/PropertyOverview";
import PropertyDetails from "./_components/PropertyDetails";
import PropertyLocation from "./_components/PropertyLocation";
import ContactWidget from "./_components/ContactWidget";
import ApplicationModal from "./_components/ApplicationModal";
import { Skeleton } from "@/components/ui/skeleton";

const SingleListing = () => {
  const { id } = useParams();
  const propertyId = String(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();

  return (
    <div>
      <ImagePreviews propertyId={propertyId} />

      <div className="mx-10 mt-16 mb-8 flex flex-col justify-center gap-10 md:mx-auto md:w-2/3 md:flex-row">
        <div className="order-2 w-full md:order-1">
          <PropertyOverview propertyId={propertyId} />
          <PropertyDetails propertyId={propertyId} />
          <PropertyLocation propertyId={propertyId} />
        </div>

        <div className="order-1 md:order-2">
          <ContactWidget
            onOpenModal={() => setIsModalOpen(true)}
            propertyId={propertyId}
          />
        </div>
      </div>

      {authUser && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          propertyId={propertyId}
        />
      )}
    </div>
  );
};

export default SingleListing;
