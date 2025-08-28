import { Mail, MapPin, PhoneCall } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function ApplicationCard({
  application,
  userType,
  children,
}: ApplicationCardProps) {
  const [imgSrc, setImgSrc] = useState(
    application.property.photoUrls?.[0] || "/placeholder.jpg",
  );

  const statusColor =
    application.status === "Approved"
      ? "bg-green-500"
      : application.status === "Denied"
        ? "bg-red-500"
        : "bg-yellow-500";

  const contactPerson =
    userType === "manager" ? application.tenant : application.manager;

  return (
    <div className="mb-4 overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="flex flex-col items-start justify-between gap-6 px-6 py-6 md:px-4 lg:flex-row lg:items-center lg:gap-4">
        {/* Property Info Section */}
        <div className="flex w-full flex-col gap-5 lg:w-auto lg:flex-row">
          <Image
            src={imgSrc}
            alt={application.property.name}
            width={200}
            height={150}
            className="h-[150px] w-full rounded-xl object-cover lg:w-[200px]"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImgSrc("/placeholder.jpg")}
          />
          <div className="flex flex-col justify-between">
            <div>
              <h2 className="my-2 text-xl font-bold">
                {application.property.name}
              </h2>
              <div className="mb-2 flex items-center">
                <MapPin className="mr-1 h-5 w-5" />
                <span>{`${application.property.location.city}, ${application.property.location.country}`}</span>
              </div>
            </div>
            <div className="text-xl font-semibold">
              ${application.property.pricePerMonth}{" "}
              <span className="text-sm font-normal">/ month</span>
            </div>
          </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="border-primary-200 hidden h-48 border-[0.5px] lg:block" />

        {/* Status Section */}
        <div className="flex w-full flex-col justify-between gap-3 py-2 lg:h-48 lg:basis-2/12 lg:gap-0">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Status:</span>
              <span
                className={`px-2 py-1 ${statusColor} rounded-full text-sm text-white`}
              >
                {application.status}
              </span>
            </div>
            <hr className="mt-3" />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Start Date:</span>{" "}
            {new Date(application.lease?.startDate).toLocaleDateString()}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">End Date:</span>{" "}
            {new Date(application.lease?.endDate).toLocaleDateString()}
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Next Payment:</span>{" "}
            {application.lease.nextPaymentDate?.toLocaleDateString()}
          </div>
        </div>

        {/* Divider - visible only on desktop */}
        <div className="border-primary-200 hidden h-48 border-[0.5px] lg:block" />

        {/* Contact Person Section */}
        <div className="flex w-full flex-col justify-start gap-5 py-2 lg:h-48 lg:basis-3/12">
          <div>
            <div className="text-lg font-semibold">
              {userType === "manager" ? "Tenant" : "Manager"}
            </div>
            <hr className="mt-3" />
          </div>
          <div className="flex gap-4">
            <div>
              <Image
                src="/landing-i1.png"
                alt={contactPerson.name}
                width={40}
                height={40}
                className="mr-2 min-h-[40px] min-w-[40px] rounded-full"
              />
            </div>
            <div className="flex flex-col gap-2">
              <div className="font-semibold">{contactPerson.name}</div>
              <div className="text-primary-600 flex items-center text-sm">
                <PhoneCall className="mr-2 h-5 w-5" />
                {contactPerson.phoneNumber}
              </div>
              <div className="text-primary-600 flex items-center text-sm">
                <Mail className="mr-2 h-5 w-5" />
                {contactPerson.email}
              </div>
            </div>
          </div>
        </div>
      </div>

      <hr className="my-4" />
      {children}
    </div>
  );
}

export default ApplicationCard;
