"use client";
import { SignUpData } from "@/lib/schemas";
import { CircleSlash } from "lucide-react";
import React from "react";
import { useFormContext, useFormState } from "react-hook-form";

type SignUpErrorMessage = {
  className?: string;
} & React.ComponentProps<"div">;
function SignUpErrorMessage({ className, ...props }: SignUpErrorMessage) {
  const {
    formState: { errors },
  } = useFormContext<SignUpData>();
  const pwdMsg = errors.password?.message; // Message | undefined
  const confPwdMsg = errors.confirmPassword?.message;
  if (!pwdMsg && !confPwdMsg) return null;
  return (
    <div className={className} {...props}>
      {pwdMsg ? (
        <div className="flex items-center justify-start gap-2 font-medium">
          <CircleSlash className="h-5 w-5 text-inherit" strokeWidth={2} />
          <p data-slot="form-message" className="text-destructive text-sm">
            {pwdMsg}
          </p>
        </div>
      ) : null}

      {/* confirmPassword */}
      {confPwdMsg ? (
        <div className="flex items-center justify-start gap-2 font-medium">
          <CircleSlash className="h-5 w-5 text-inherit" strokeWidth={2} />
          <p data-slot="form-message" className="text-destructive text-sm">
            {confPwdMsg}
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default SignUpErrorMessage;
