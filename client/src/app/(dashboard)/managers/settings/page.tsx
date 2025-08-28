"use client";

import SettingsForm from "@/components/custom/SettingsForm";
import { useAuthManager } from "@/hooks/useAuthType";
import { useUpdateManagerSettingsMutation } from "@/state/api";
import { signOut } from "aws-amplify/auth";
import React, { useEffect } from "react";

const ManagerSettings = () => {
  const { data: authManager, isLoading } = useAuthManager();
  const [updateManager] = useUpdateManagerSettingsMutation();
  useEffect(() => {
    if (!isLoading && !authManager) {
      (async () => {
        try {
          await signOut();
        } finally {
          window.location.href = "/";
        }
      })();
    }
  }, [isLoading, authManager]);

  if (isLoading) return <>Loading...</>;
  if (!authManager) return <>Signing out…</>;

  const initialData = {
    name: authManager?.userInfo.data.name,
    email: authManager?.userInfo.data.email,
    phoneNumber: authManager?.userInfo.data.phoneNumber,
  };

  const handleSubmit = async (data: typeof initialData) => {
    await updateManager({
      cognitoId: authManager?.cognitoInfo?.userId as string,
      ...data,
    });
  };

  return (
    <SettingsForm
      initialData={initialData}
      onSubmit={handleSubmit}
      userType="manager"
    />
  );
};

export default ManagerSettings;
