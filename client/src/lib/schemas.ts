import * as z from "zod";
import { PropertyTypeEnum } from "@/lib/constants";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  pricePerMonth: z.coerce.number().positive().min(0).int(),
  securityDeposit: z.coerce.number().positive().min(0).int(),
  applicationFee: z.coerce.number().positive().min(0).int(),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z
    .array(z.instanceof(File))
    .min(1, "At least one photo is required"),
  amenities: z.string().min(1, "Amenities are required"),
  highlights: z.string().min(1, "Highlights are required"),
  beds: z.coerce.number().positive().min(0).max(10).int(),
  baths: z.coerce.number().positive().min(0).max(10).int(),
  squareFeet: z.coerce.number().int().positive(),
  propertyType: z.nativeEnum(PropertyTypeEnum),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

const SPECIAL_CHAR_RE = /[!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~]/;

const passwordSchema = z
  .string({ error: "Password is required." })
  .min(8, "Password must be at least 8 characters long.")
  .refine((v) => /[0-9]/.test(v), {
    message: "Password must contain at least one number (0–9).",
  })
  .refine((v) => /[a-z]/.test(v), {
    message: "Password must contain at least one lowercase letter (a–z).",
  })
  .refine((v) => /[A-Z]/.test(v), {
    message: "Password must contain at least one uppercase letter (A–Z).",
  })
  .refine((v) => SPECIAL_CHAR_RE.test(v), {
    message: "Password must contain at least one special character.",
  });

const emailSchema = z
  .email({
    error: "Please provide a valid email address.",
  })
  .trim();

export const authSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type AuthData = z.infer<typeof authSchema>;

const ROLE_VALUES = ["tenant", "manager"] as const;

export const signUpSchema = z
  .object({
    email: emailSchema,
    username: z
      .string({ error: "Username is required." })
      .trim()
      .min(2, "Username must be at least 2 characters long.")
      .max(50, "Username cannot exceed 50 characters.")
      .regex(/^[A-Za-z0-9]+$/, {
        error: "Username may contain letters and numbers only.",
      }),
    password: passwordSchema,
    confirmPassword: z
      .string({ error: "Confirm password is required." })
      .min(8, "Confirm password must be at least 8 characters long."),
    role: z.enum(ROLE_VALUES, { error: "Please select a value." }),
  })
  .refine((data) => data.confirmPassword === data.password, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type SignUpData = z.infer<typeof signUpSchema>;
