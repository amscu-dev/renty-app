"use client";
import CognitoError from "@/components/custom/CognitoError";
import CustomAuthButton from "@/components/custom/CustomAuthButton";
import { CustomFormField } from "@/components/custom/FormField";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { AuthData, authSchema } from "@/lib/schemas";
import { cn, formatCognitoErrorMessages } from "@/lib/utils";
import { handleSignIn } from "@/services/auth/authCognito";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthSession, fetchAuthSession } from "aws-amplify/auth";
import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import {
  DEFAULT_LOGIN_REDIRECT_MANAGERS,
  DEFAULT_LOGIN_REDIRECT_TENANTS,
} from "../../../../routes";

function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthSuccess, setIsAuthSuccess] = useState(false);
  const [cognitoError, setCognitoError] = useState<string>("");
  const router = useRouter();
  const form = useForm<AuthData>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    criteriaMode: "all",
    mode: "onTouched",
  });

  const onSubmit: SubmitHandler<AuthData> = async (data) => {
    const userData = { email: data.email };
    setIsLoading(true);
    setCognitoError("");
    try {
      const response = await handleSignIn(data);

      if (response.nextStep.signInStep === "CONFIRM_SIGN_UP") {
        setIsAuthSuccess(true);
        setTimeout(() => {
          router.push(
            `/confirmSignUp?data=${encodeURIComponent(JSON.stringify(userData))}`,
          );
        }, 1000);
      }
      // OK
      if (response.nextStep.signInStep === "DONE") {
        setIsAuthSuccess(true);
        const session: AuthSession = await fetchAuthSession();
        const { idToken } = session.tokens ?? {};
        const userRole = idToken?.payload["custom:role"] as string;
        const endpoint =
          userRole === "manager"
            ? DEFAULT_LOGIN_REDIRECT_MANAGERS
            : DEFAULT_LOGIN_REDIRECT_TENANTS;
        setTimeout(() => {
          router.replace(endpoint);
        }, 1000);
      }
      // MFA
    } catch (error) {
      const errorMessage = formatCognitoErrorMessages(error);
      setCognitoError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <div className="mb-4 flex items-center justify-center">
        <div className="bounce-logo relative flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
          <Image src="/logo.svg" alt="Rentiful Logo" width={24} height={24} />
        </div>
      </div>
      <div className="mb-4 flex flex-col items-center justify-center gap-1">
        <h2 className="text-2xl font-semibold text-slate-800">Welcome back</h2>
        <p className="text-muted-foreground">
          Please enter your details to sign in
        </p>
      </div>
      <div className="mb-4 h-0.5 bg-gradient-to-r from-white via-slate-900 to-white"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name="email"
            label="Email"
            type="email"
            placeholder="✉️ johndoe@mail.com"
            disabled={isLoading || isAuthSuccess}
          />
          <div className="relative">
            <CustomFormField
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="🔒 Password"
              disabled={isLoading || isAuthSuccess}
            />
            <Button
              type="button"
              variant="ghost"
              disabled={isLoading}
              size="icon"
              className="absolute top-1/2 right-0 h-1/2 -translate-y-[2px] cursor-pointer text-gray-400 hover:bg-transparent hover:text-orange-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              <span className="sr-only">
                {showPassword ? "Hide password" : "Show password"}
              </span>
            </Button>
          </div>
          <div className="flex items-center justify-end">
            <Link
              href="/"
              aria-disabled={isLoading || isAuthSuccess}
              className={cn(
                "mt-[-5px] font-mono text-xs text-slate-700 hover:text-blue-600",
                isAuthSuccess || isLoading ? "pointer-events-none" : "",
              )}
            >
              Forgot your password?
            </Link>
          </div>
          <CognitoError message={cognitoError} />
          <div className="flex min-h-16 items-center justify-center">
            <CustomAuthButton
              disabled={isLoading || isAuthSuccess}
              className={cn(
                "",
                isAuthSuccess || isLoading ? "cursor-not-allowed" : "",
              )}
            >
              {isLoading ? (
                <RotatingLines
                  visible={true}
                  width="24"
                  strokeWidth="5"
                  strokeColor="white"
                  animationDuration="0.75"
                />
              ) : isAuthSuccess ? (
                <CheckCircle2Icon />
              ) : (
                "Sign In"
              )}
            </CustomAuthButton>
          </div>
        </form>
      </Form>
      <div className="mt-8 flex items-center justify-center">
        <p className="text-md text-muted-foreground">
          Don&apos;t you have an account?{" "}
          <span className="ml-[0.5px] font-bold text-slate-700 hover:text-slate-950">
            <Link
              href="/signup"
              aria-disabled={isLoading || isAuthSuccess}
              className={cn(
                "",
                isAuthSuccess || isLoading ? "pointer-events-none" : "",
              )}
            >
              Sign up
            </Link>
          </span>
        </p>
      </div>
      <div className="mt-4 text-center text-xs font-bold">
        <span className="text-muted-foreground"> &copy; 2025</span> RENT
        <span className="text-secondary-500 group-hover:!text-primary-300 font-medium">
          EASE
        </span>
      </div>
    </div>
  );
}

export default SignInPage;
