"use client";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import { Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const ContactWidget = ({ onOpenModal, propertyId }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();

  const handleButtonClick = () => {
    if (authUser) {
      onOpenModal();
    } else {
      router.push("/signin");
    }
  };
  const {
    data: property,
    isError,
    isLoading,
  } = useGetPropertyQuery(propertyId);

  if (isLoading)
    return (
      <div>
        <Skeleton className="h-[200px] w-[300px] bg-slate-300 shadow-xl" />
      </div>
    );
  if (isError || !property) return;
  const isOwnProperty =
    property.managerCognitoId === authUser?.userInfo.data.cognitoId;
  return (
    <div className="border-primary-200 h-fit min-w-[300px] rounded-2xl border bg-white p-7">
      {/* Contact Property */}
      <div className="border-primary-200 mb-4 flex items-center gap-5 rounded-xl border p-4">
        <div className="bg-primary-900 flex items-center rounded-full p-4">
          <Phone className="text-primary-50" size={15} />
        </div>
        <div>
          <p>Contact This Property</p>
          <div className="text-primary-800 text-lg font-bold">
            (424) 340-5574
          </div>
        </div>
      </div>
      <Button
        className="bg-primary-700 hover:bg-primary-600 w-full cursor-pointer text-white"
        onClick={handleButtonClick}
        disabled={isOwnProperty}
      >
        {authUser && !isOwnProperty
          ? "Submit Application"
          : isOwnProperty
            ? "You own this property"
            : "Sign in to apply"}
      </Button>

      <hr className="my-4" />
      <div className="text-sm">
        <div className="text-primary-600 mb-1">Language: English, Bahasa.</div>
        <div className="text-primary-600">
          Open by appointment on Monday - Sunday
        </div>
      </div>
    </div>
  );
};

export default ContactWidget;
