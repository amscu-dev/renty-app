"use client";
import ApplicationCard from "@/components/custom/ApplicationCard";
import DashboardPagesHeader from "@/components/custom/DashboardPagesHeader";
import NoData from "@/components/custom/NoData";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import { CircleCheckBig, Clock, Download, XCircle } from "lucide-react";
import React from "react";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const {
    data: applications,
    isLoading,
    isError,
  } = useGetApplicationsQuery({
    userId: authUser?.cognitoInfo?.userId,
    userType: "tenant",
  });

  if (isLoading) return <div>loading...</div>;
  if (isError || !applications)
    return <NoData message="There was an error fetching properties." />;

  return (
    <div className="dashboard-container">
      <DashboardPagesHeader
        title="Applications"
        subtitle="Track and manage your property rental applications"
      />
      <div className="w-full">
        {applications?.map((application) => (
          <ApplicationCard
            key={application._id}
            application={application}
            userType="renter"
          >
            <div className="flex w-full justify-between gap-5 px-4 pb-4">
              {application.status === "Approved" ? (
                <div className="flex grow items-center bg-green-100 p-4 text-green-700">
                  <CircleCheckBig className="mr-2 h-5 w-5" />
                  The property is being rented by you until{" "}
                  {new Date(application.lease?.endDate).toLocaleDateString()}
                </div>
              ) : application.status === "Pending" ? (
                <div className="flex grow items-center bg-yellow-100 p-4 text-yellow-700">
                  <Clock className="mr-2 h-5 w-5" />
                  Your application is pending approval
                </div>
              ) : (
                <div className="flex grow items-center bg-red-100 p-4 text-red-700">
                  <XCircle className="mr-2 h-5 w-5" />
                  Your application has been denied
                </div>
              )}

              <button
                className={`hover:bg-primary-700 hover:text-primary-50 flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700`}
              >
                <Download className="mr-2 h-5 w-5" />
                Download Agreement
              </button>
            </div>
          </ApplicationCard>
        ))}
        {applications.length === 0 && (
          <NoData
            message="You don&lsquo;t have any applications."
            containerClassName="mt-48"
          />
        )}
      </div>
    </div>
  );
};

export default Applications;
