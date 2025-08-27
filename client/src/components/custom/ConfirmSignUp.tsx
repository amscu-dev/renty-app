"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import VerificationInput from "react-verification-input";
import CustomAuthButton from "./CustomAuthButton";
import { RotatingLines } from "react-loader-spinner";
import {
  BadgeCheck,
  CheckCircle,
  CheckCircle2Icon,
  CircleCheck,
} from "lucide-react";
import {
  handleConfirmSignUp,
  handleResendSignUpVerificationCode,
} from "@/services/auth/authCognito";
import { cn, formatCognitoErrorMessages } from "@/lib/utils";
import CognitoError from "./CognitoError";
import { useRouter } from "next/navigation";
import {
  AuthSession,
  AuthUser,
  autoSignIn,
  fetchAuthSession,
  getCurrentUser,
} from "aws-amplify/auth";

function ConfirmSignUp({ email }: { email: string }) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const router = useRouter();
  const [isResedingToken, setIsResedingToken] = useState(false);
  const [isResendSuccess, setIsResendSuccess] = useState(false);
  const [isVerifingToken, setVerifingToken] = useState(false);
  const [isSignupComplete, setSignupComplete] = useState(false);
  const [cognitoError, setCognitoError] = useState<string>("");
  useEffect(() => {
    window.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Backspace") inputRef.current?.focus();
    });
  }, []);
  const onSubmit = async (code: string) => {
    inputRef.current!.blur();
    setVerifingToken(true);
    setCognitoError("");
    try {
      const response = await handleConfirmSignUp({ email, code });
      if (
        response.nextStep.signUpStep === "COMPLETE_AUTO_SIGN_IN" &&
        response.isSignUpComplete
      ) {
        const { isSignedIn, nextStep } = await autoSignIn();
        if (isSignedIn && nextStep.signInStep === "DONE") {
          const session: AuthSession = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const userRole = idToken?.payload["custom:role"] as
            | "manager"
            | "tenant";
          const redirectLink =
            userRole === "manager"
              ? `/managers/properties`
              : `/tenants/favorites`;
          setSignupComplete(true);
          setTimeout(() => {
            router.replace(redirectLink);
          }, 1000);
        }
      }
    } catch (error) {
      const errorMessage = formatCognitoErrorMessages(error);
      setCognitoError(errorMessage);
      inputRef.current!.focus();
    } finally {
      setVerifingToken(false);
    }
  };

  //
  const handleResend = async () => {
    setIsResedingToken(true);
    try {
      const response = await handleResendSignUpVerificationCode({ email });
      if (response.attributeName === "email") {
        setIsResendSuccess(true);
        setTimeout(() => {
          setIsResendSuccess(false);
        }, 1500);
      }
    } catch (error) {
      const errorMessage = formatCognitoErrorMessages(error);
      setCognitoError(errorMessage);
    } finally {
      setIsResedingToken(false);
    }
  };
  return (
    <div className={cn("relative", isVerifingToken ? "cursor-progress" : "")}>
      {(isVerifingToken || isSignupComplete) && (
        <div className="absolute inset-0 z-50 flex scale-125 items-center justify-center opacity-100">
          {isSignupComplete ? (
            <div className="flex flex-col items-center justify-center gap-4">
              <CircleCheck
                className="h-20 w-20 fill-green-600"
                stroke="white"
                strokeWidth={2}
              />

              <div className="flex items-center justify-center gap-2">
                <p className="text-xs font-semibold text-slate-600">
                  You will be redirected to your dashboard
                </p>
                <RotatingLines
                  visible={true}
                  width="12"
                  strokeWidth="5"
                  strokeColor="orange"
                  animationDuration="0.75"
                />
              </div>
            </div>
          ) : (
            <RotatingLines
              visible={true}
              width="24"
              strokeWidth="5"
              strokeColor="orange"
              animationDuration="0.75"
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "",
          isVerifingToken || isSignupComplete ? "opacity-25" : "",
        )}
      >
        <div className="mb-4 flex items-center justify-center">
          <div
            className={cn(
              "relative flex h-12 w-12 items-center justify-center rounded-full bg-orange-500",
              isVerifingToken || isSignupComplete ? "" : "bounce-logo",
            )}
          >
            <Image src="/logo.svg" alt="Rentiful Logo" width={24} height={24} />
          </div>
        </div>
        <div className="mb-4 flex flex-col items-center justify-center gap-1">
          <h2 className="text-2xl font-semibold text-slate-800">
            Check your email
          </h2>
          <p className="text-muted-foreground mt-2">
            We’ve sent a verification code to{" "}
            <span className="font-mono font-semibold text-slate-800">
              {email}
            </span>
            . Open the message, copy the code, then come back here and enter it
            below.
          </p>
        </div>
        <div className="my-10 flex items-center justify-center">
          <VerificationInput
            inputProps={{
              disabled: isVerifingToken || isSignupComplete,
              inputMode: "numeric",
              autoComplete: "one-time-code",
              pattern: "[0-9]*",
              "aria-label": "Verification code",
            }}
            ref={inputRef}
            length={6}
            validChars="0-9"
            placeholder="·"
            autoFocus={true}
            passwordMode={false}
            classNames={{
              container: "container-input",
              character: "character-input",
              characterInactive: "character-input--inactive",
              characterSelected: "character-input--selected",
              characterFilled: "character-input--filled",
            }}
            onComplete={onSubmit}
            onChange={() => {
              setCognitoError("");
            }}
          />
        </div>
        <CognitoError message={cognitoError} />
        <div className="mt-8 flex items-center justify-center gap-4">
          <p className="text-md text-muted-foreground min-w-max translate-y-[2px]">
            Didn’t get your verification code?
          </p>
          <CustomAuthButton
            disabled={
              isVerifingToken ||
              isResedingToken ||
              isResendSuccess ||
              isSignupComplete
            }
            className={cn(
              "px-1!",
              isVerifingToken || isResedingToken || isResendSuccess
                ? "cursor-not-allowed"
                : "",
            )}
            onclick={handleResend}
          >
            {isResedingToken ? (
              <RotatingLines
                visible={true}
                width="24"
                strokeWidth="5"
                strokeColor="white"
                animationDuration="0.75"
              />
            ) : isResendSuccess ? (
              <CheckCircle2Icon />
            ) : (
              "Resent Code"
            )}
          </CustomAuthButton>
        </div>
        <div className="mt-4 text-center text-xs font-bold">
          <span className="text-muted-foreground"> &copy; 2025</span> RENT
          <span className="text-secondary-500 group-hover:!text-primary-300 font-medium">
            EASE
          </span>
        </div>
      </div>
    </div>
  );
}

export default ConfirmSignUp;
