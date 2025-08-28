import { model, Model, Schema } from "mongoose";
import { IApplication, ApplicationStatus } from "./application.interface";

const applicationSchema: Schema<IApplication> = new Schema(
  {
    status: {
      type: String,
      required: [true, "Status is required."],
      enum: {
        values: Object.values(ApplicationStatus),
        message: `Invalid application status "{VALUE}". Allowed: 
         ${Object.values(ApplicationStatus).join(", ")}`,
      },
    },
    applicationDate: {
      type: String,
      required: [true, "Application date is required."],
    },
    name: {
      type: String,
      required: [true, "Name is required."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      trim: true,
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },
    message: { type: String, trim: true },
    tenantCognitoId: {
      type: String,
      required: [true, "Tenant Cognito ID is required."],
      index: true,
      trim: true,
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property reference is required."],
    },
    lease: {
      type: Schema.Types.ObjectId,
      ref: "Lease",
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant reference is required."],
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Manager",
      required: [true, "Tenant reference is required."],
    },
  },
  { timestamps: true }
);

export const Application: Model<IApplication> = model(
  "Application",
  applicationSchema
);
