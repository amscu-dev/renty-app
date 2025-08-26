"use client";

import { useModality } from "@/hooks/useModalityInteraction";
import ConfigureAmplifyClientSide from "@/services/auth/amplify-cognito.config";
import StoreProvider from "@/state/redux";

const Providers = ({ children }: { children: React.ReactNode }) => {
  useModality();
  return (
    <StoreProvider>
      <ConfigureAmplifyClientSide />
      {children}
    </StoreProvider>
  );
};

export default Providers;
