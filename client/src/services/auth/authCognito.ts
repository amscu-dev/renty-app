import { SignUpData } from "@/lib/schemas";
import {
  confirmSignUp,
  resendSignUpCode,
  signIn,
  signUp,
} from "aws-amplify/auth";

type HandleSignUp = Omit<SignUpData, "confirmPassword">;

export async function handleSignUp({
  email,
  username,
  password,
  role,
}: HandleSignUp) {
  const response = await signUp({
    username: String(email),
    password: String(password),
    options: {
      userAttributes: {
        email: String(email),
        preferred_username: String(username),
        "custom:role": role,
      },
    },
  });
  return response;
}

export async function handleConfirmSignUp({
  email,
  code,
}: {
  email: string;
  code: string;
}) {
  const response = await confirmSignUp({
    username: String(email),
    confirmationCode: String(code),
  });
  return response;
}

export async function handleResendSignUpVerificationCode({
  email,
}: {
  email: string;
}) {
  const response = await resendSignUpCode({
    username: String(email),
  });
  return response;
}

export async function handleSignIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const response = await signIn({
    username: String(email),
    password: String(password),
  });
  if (response.nextStep.signInStep === "CONFIRM_SIGN_UP") {
    await resendSignUpCode({
      username: String(email),
    });
  }
  return response;
}
