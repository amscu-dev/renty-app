import { checkSchema } from "express-validator";

export const createApplicationValidator = checkSchema(
  {
    propertyId: {
      notEmpty: { errorMessage: "Property reference is required." },
      isMongoId: { errorMessage: "Property must be a valid MongoDB ObjectId." },
    },
    applicationDate: {
      notEmpty: { errorMessage: "Application date is required." },
      isISO8601: {
        options: { strict: true, strictSeparator: true },
        errorMessage: "Application date must be a valid ISO-8601 date.",
      },
      // toDate: true,
      // ex: "2025-08-16T10:00:00Z" -> Date
    },
    name: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "Name is required." },
      isString: { errorMessage: "Name must be a string." },
      isLength: {
        options: { min: 2, max: 100 },
        errorMessage: "Name must be between 2 and 100 characters.",
      },
    },
    email: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "Email is required." },
      isEmail: { errorMessage: "Please provide a valid email address." },
    },
    phoneNumber: {
      trim: true,
      escape: true,
      notEmpty: { errorMessage: "Phone number is required." },
      isMobilePhone: {
        options: "any",
        errorMessage: "Please provide a valid mobile phone number.",
      },
    },
    message: {
      optional: true,
      escape: true,
      trim: true,
      isString: { errorMessage: "Message must be a string." },
      isLength: {
        options: { max: 2000 },
        errorMessage: "Message cannot exceed 2000 characters.",
      },
    },
  },
  ["body"]
);
