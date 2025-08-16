import { Schema, Model, model } from "mongoose";
import { type ITenant } from "./tenant.interface";

const tenantSchema: Schema<ITenant> = new Schema(
  {
    cognitoId: {
      type: String,
      required: [true, "CognitoId is required!"],
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Tentant name is required."],
      minLength: [4, "Name cannot have less  than 4 characters."],
      maxLength: [50, "Name cannot have more than 50 characters."],
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Tenant email adress is required."],
    },
    phoneNumber: String,
    applications: [
      { type: Schema.Types.ObjectId, ref: "Application", default: [] },
    ],
    leases: [{ type: Schema.Types.ObjectId, ref: "Lease", default: [] }],
    favorites: [{ type: Schema.Types.ObjectId, ref: "Property", default: [] }],
    properties: [{ type: Schema.Types.ObjectId, ref: "Property", default: [] }],
  },
  {
    timestamps: true,
  }
);

export const Tenant: Model<ITenant> = model("Tenant", tenantSchema);
