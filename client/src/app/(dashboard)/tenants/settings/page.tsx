"use client";

import SettingsForm from "@/components/custom/SettingsForm";
import { useAuthTenant } from "@/hooks/useAuthType";
import { useUpdateTenantSettingsMutation } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import React, { useEffect } from "react";

const TenantSettings = () => {
  const { data: authTenant, isLoading } = useAuthTenant();
  const [updateTenant] = useUpdateTenantSettingsMutation();
  useEffect(() => {
    if (!isLoading && !authTenant) {
      (async () => {
        try {
          await signOut();
        } finally {
          window.location.href = "/";
        }
      })();
    }
  }, [isLoading, authTenant]);

  if (isLoading) return <>Loading...</>;
  if (!authTenant) return <>Signing out…</>;

  const initialData = {
    name: authTenant?.userInfo.data.name,
    email: authTenant?.userInfo.data.email,
    phoneNumber: authTenant?.userInfo.data.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateTenant({
      cognitoId: authTenant?.cognitoInfo?.userId as string,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="tenant"
    />
  );
};

export default TenantSettings;
