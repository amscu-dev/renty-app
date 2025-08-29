"use client";

import { Form } from "@/components/ui/form";
import { PropertyFormData, propertySchema } from "@/lib/schemas";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";
import { AmenityEnum, HighlightEnum, PropertyTypeEnum } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import DashboardPagesHeader from "@/components/custom/DashboardPagesHeader";
import { CustomFormField } from "@/components/custom/FormField";
import { RotatingLines } from "react-loader-spinner";
import { useRouter } from "next/navigation";

function CreateNewPropertyPage() {
  const { data: authUser } = useGetAuthUserQuery();
  const [error, setError] = useState<string | undefined>();
  const router = useRouter();
  const [
    createProperty,
    { isLoading: isCreatingNewProperty, data, isSuccess },
  ] = useCreatePropertyMutation();

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema) as Resolver<PropertyFormData>,
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 1000,
      securityDeposit: 500,
      applicationFee: 100,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: [],
      highlights: [],
      beds: 1,
      baths: 1,
      squareFeet: 1000,
      address: "",
      housenumber: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo?.userId) throw new Error("No manager ID found");
    setError(undefined);
    const { photoUrls, ...rest } = data;

    const payload = {
      ...rest,
      managerCognitoId: authUser.cognitoInfo.userId,
    };
    const formData = new FormData();
    formData.append("data", JSON.stringify(payload));

    for (const file of photoUrls) {
      formData.append("photos", file);
    }
    try {
      const created = await createProperty(formData).unwrap();
      if (created._id) {
        form.reset();
        router.replace(`/search/${created._id}`);
      }
    } catch (error) {
      console.log(error);
      if (typeof error === "object" && error && "status" in error) {
        if (error.status === 400 || error.status === 404) {
          setError("Please provided a valid address for your location.");
        }
      }
    }
  };

  return (
    <div className="dashboard-container">
      <DashboardPagesHeader
        title="Add New Property"
        subtitle="Create a new property listing with detailed information"
      />
      <div className="rounded-xl bg-white p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 p-4"
          >
            {/* Basic Information */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">Basic Information</h2>
              <div className="space-y-4">
                <CustomFormField
                  name="name"
                  label="Property Name"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="description"
                  label="Description"
                  type="textarea"
                  disabled={isCreatingNewProperty}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Fees */}
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">Fees</h2>
              <CustomFormField
                name="pricePerMonth"
                label="Price per Month"
                type="number"
                disabled={isCreatingNewProperty}
              />
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="securityDeposit"
                  label="Security Deposit"
                  type="number"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="applicationFee"
                  label="Application Fee"
                  type="number"
                  disabled={isCreatingNewProperty}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Property Details */}
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">Property Details</h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <CustomFormField
                  name="beds"
                  label="Number of Beds"
                  type="number"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="baths"
                  label="Number of Baths"
                  type="number"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="squareFeet"
                  label="Square Feet"
                  type="number"
                  disabled={isCreatingNewProperty}
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField
                  name="isPetsAllowed"
                  label="Pets Allowed"
                  type="switch"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="isParkingIncluded"
                  label="Parking Included"
                  type="switch"
                  disabled={isCreatingNewProperty}
                />
              </div>
              <div className="mt-4">
                <CustomFormField
                  name="propertyType"
                  label="Property Type"
                  type="select"
                  disabled={isCreatingNewProperty}
                  options={Object.keys(PropertyTypeEnum).map((type) => ({
                    value: type,
                    label: type,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Amenities and Highlights */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">
                Amenities and Highlights
              </h2>
              <div className="space-y-6">
                <CustomFormField
                  name="amenities"
                  label="Amenities"
                  placeholder="Please choose one or more amenities"
                  type="multi-select"
                  disabled={isCreatingNewProperty}
                  options={Object.keys(AmenityEnum).map((amenity) => ({
                    value: amenity,
                    label: amenity,
                  }))}
                />
                <CustomFormField
                  name="highlights"
                  label="Highlights"
                  placeholder="Please choose one or more highlights"
                  type="multi-select"
                  disabled={isCreatingNewProperty}
                  options={Object.keys(HighlightEnum).map((highlight) => ({
                    value: highlight,
                    label: highlight,
                  }))}
                />
              </div>
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Photos */}
            <div>
              <h2 className="mb-4 text-lg font-semibold">Photos</h2>
              <CustomFormField
                name="photoUrls"
                label="Property Photos"
                type="file"
                accept="image/*"
                disabled={isCreatingNewProperty}
              />
            </div>

            <hr className="my-6 border-gray-200" />

            {/* Additional Information */}
            <div className="space-y-6">
              <h2 className="mb-4 text-lg font-semibold">
                Additional Information
              </h2>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <CustomFormField name="address" label="Address" />
                <CustomFormField
                  name="housenumber"
                  label="Property Address Number"
                />
              </div>
              <div className="flex justify-between gap-4">
                <CustomFormField name="city" label="City" className="w-full" />
                <CustomFormField
                  name="state"
                  label="State"
                  className="w-full"
                  disabled={isCreatingNewProperty}
                />
                <CustomFormField
                  name="postalCode"
                  label="Postal Code"
                  className="w-full"
                  disabled={isCreatingNewProperty}
                />
              </div>
              <CustomFormField
                name="country"
                label="Country"
                disabled={isCreatingNewProperty}
              />
            </div>

            <Button
              type="submit"
              className="mt-8 flex w-full cursor-pointer items-center justify-center bg-slate-900 text-white hover:bg-orange-600"
              disabled={isCreatingNewProperty}
            >
              {isCreatingNewProperty ? (
                <RotatingLines
                  visible={true}
                  width="12"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                />
              ) : (
                "Create Property"
              )}
            </Button>
            {error && (
              <div className="rounded-xl bg-red-400 px-6 py-3 text-base font-light text-white">
                {error}
              </div>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}

export default CreateNewPropertyPage;
