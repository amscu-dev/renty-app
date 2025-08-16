import { model, Model, Schema } from "mongoose";
import { ILease } from "./lease.interface";

const leaseSchema: Schema<ILease> = new Schema(
  {
    startDate: {
      type: Date,
      required: [true, "Lease start date is required."],
    },
    endDate: {
      type: Date,
      required: [true, "Lease end date is required."],
      validate: {
        validator: function (this: ILease, v: Date) {
          if (!v || !this.startDate) return true;
          return v.getTime() >= this.startDate.getTime();
        },
        message: "Lease end date must be on or after the start date.",
      },
    },
    rent: {
      type: Number,
      required: [true, "Monthly rent is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Monthly rent must be greater than 0.",
      },
    },
    deposit: {
      type: Number,
      required: [true, "Security deposit is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Security deposit must be greater than 0.",
      },
    },
    tenantCognitoId: {
      type: String,
      required: [true, "Tenant Cognito ID is required."],
      trim: true,
    },
    tenant: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant reference is required."],
    },
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: [true, "Property reference is required."],
    },
    application: {
      type: Schema.Types.ObjectId,
      ref: "Application",
    },
    payments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Payment",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

export const Lease: Model<ILease> = model("Lease", leaseSchema);
