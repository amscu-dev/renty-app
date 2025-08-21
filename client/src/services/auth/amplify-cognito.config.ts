"use client";
import { Amplify } from "aws-amplify";
import { authConfig } from "./cognito.config";

Amplify.configure(
  {
    Auth: authConfig,
  },
  { ssr: true },
);

export default function ConfigureAmplifyClientSide() {
  return null;
}
