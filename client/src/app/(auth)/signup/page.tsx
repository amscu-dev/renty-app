"use client";
import CognitoError from "@/components/custom/CognitoError";
import CustomAuthButton from "@/components/custom/CustomAuthButton";
import { CustomFormField } from "@/components/custom/FormField";
import SignUpErrorMessage from "@/components/custom/SignUpErrorMessage";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { SignUpData, signUpSchema } from "@/lib/schemas";
import { cn, formatCognitoErrorMessages } from "@/lib/utils";
import { handleSignUp } from "@/services/auth/authCognito";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2Icon, Eye, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";

function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [cognitoError, setCognitoError] = useState<string>("");
  const [isSignUpSuccess, setSignUpSuccess] = useState(false);
  const hasCognitoError = !!cognitoError;
  const router = useRouter();
  const form = useForm<SignUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: undefined,
    },
    criteriaMode: "all",
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<SignUpData> = async (data) => {
    const userData = { email: data.email };
    try {
      setCognitoError("");
      const signUpResponse = await handleSignUp(data);
      if (signUpResponse.nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setSignUpSuccess(true);
        setTimeout(() => {
          router.push(
            `/confirmSignUp?data=${encodeURIComponent(JSON.stringify(userData))}`,
          );
        }, 1000);
      }
    } catch (error: unknown) {
      const errorMessage = formatCognitoErrorMessages(error);
      setCognitoError(errorMessage);
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
        <h2 className="text-2xl font-semibold text-slate-800">
          Create Account
        </h2>
        <p className="text-muted-foreground">
          Experience authentic places, travel smarter today
        </p>
      </div>
      <div className="mb-4 h-0.5 bg-gradient-to-r from-white via-slate-900 to-white"></div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <CustomFormField
            name="username"
            label="Username"
            type="text"
            placeholder="🕹️ John Doe"
            disabled={
              form.formState.isSubmitting ||
              (isSignUpSuccess && !hasCognitoError)
            }
          />
          <CustomFormField
            name="email"
            label="Email"
            type="email"
            placeholder="✉️ johndoe@mail.com"
            disabled={
              form.formState.isSubmitting ||
              (isSignUpSuccess && !hasCognitoError)
            }
          />
          <div className="flex items-center justify-center gap-4">
            <div className="relative">
              <CustomFormField
                name="password"
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="🔒 Password"
                showErrorMessage={false}
                disabled={
                  form.formState.isSubmitting ||
                  (isSignUpSuccess && !hasCognitoError)
                }
              />
              <Button
                type="button"
                variant="ghost"
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
            <div className="relative">
              <CustomFormField
                name="confirmPassword"
                label="Confirm Password"
                type={showPassword ? "text" : "password"}
                placeholder="🔒 Confirm Password"
                showErrorMessage={false}
                disabled={
                  form.formState.isSubmitting ||
                  (isSignUpSuccess && !hasCognitoError)
                }
              />
              <Button
                type="button"
                variant="ghost"
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
          </div>
          <div>
            <SignUpErrorMessage
              className="flex flex-col gap-2 rounded-md bg-red-200 px-4 py-2 font-medium text-red-600"
              onMouseDown={() => {}}
            />
          </div>
          <CustomFormField
            name="role"
            label="Are you here to host or book?"
            type="radio-group"
            optionsRadio={[
              {
                value: "tenant",
                label: "Tenant:",
                explanation: "Book a stay",
              },
              {
                value: "manager",
                label: "Manager:",
                explanation: "List a property",
              },
            ]}
            disabled={
              form.formState.isSubmitting ||
              (isSignUpSuccess && !hasCognitoError)
            }
          />

          <CognitoError message={cognitoError} />
          <CustomAuthButton
            className={cn(
              "",
              isSignUpSuccess || form.formState.isSubmitting
                ? "cursor-not-allowed"
                : "",
            )}
            disabled={
              form.formState.isSubmitting ||
              (isSignUpSuccess && !hasCognitoError)
            }
          >
            {form.formState.isSubmitting ? (
              <RotatingLines
                visible={true}
                width="24"
                strokeWidth="5"
                strokeColor="white"
                animationDuration="0.75"
              />
            ) : hasCognitoError ? (
              "Sing Up"
            ) : isSignUpSuccess ? (
              <CheckCircle2Icon />
            ) : (
              "Sign Up"
            )}
          </CustomAuthButton>
        </form>
      </Form>
      <div className="mt-8 flex items-center justify-center">
        <p className="text-md text-muted-foreground">
          Already have an account?{" "}
          <span className="ml-[0.5px] font-bold text-slate-700 hover:text-slate-950">
            <Link href="/signin">Sign in</Link>
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

export default SignUpPage;
