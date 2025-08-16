import { Schema, model, Types } from "mongoose";
import {
  Amenity,
  Highlight,
  IProperty,
  PropertyType,
} from "./property.interface";

const propertySchema = new Schema<IProperty>(
  {
    name: {
      type: String,
      required: [true, "Name of the property is required!"],
      trim: true,
      minLength: [5, "Property name  cannot have less than 5 characters."],
      maxLength: [50, "Property name  cannot have more than 50 characters."],
    },
    description: {
      type: String,
      required: [true, "Description of the property is required!"],
      trim: true,
      minLength: [
        25,
        "Property description cannot have less than 25 characters.",
      ],
      maxLength: [
        250,
        "Property description cannot have more than 250 characters.",
      ],
    },
    pricePerMonth: {
      type: Number,
      required: [true, "Monthly price is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Monthly price must be greater than 0.",
      },
    },
    securityDeposit: {
      type: Number,
      required: [true, "Security deposit is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Security deposit must be greater than 0.",
      },
    },
    applicationFee: {
      type: Number,
      required: [true, "Application fee is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Application fee must be greater than 0.",
      },
    },
    photoUrls: { type: [String], default: [] },
    amenities: [
      {
        type: String,
        enum: {
          values: Object.values(Amenity),
          message: `Amenity "{VALUE}" is not allowed. Allowed: ${Object.values(
            Amenity
          ).join(", ")}`,
        },
        default: [],
      },
    ],
    highlights: [
      {
        type: String,
        enum: {
          values: Object.values(Highlight),
          message: `Highlight "{VALUE}" is not allowed. Allowed: ${Object.values(
            Highlight
          ).join(", ")}`,
        },
        default: [],
      },
    ],
    isPetsAllowed: { type: Boolean, default: false },
    isParkingIncluded: { type: Boolean, default: false },
    beds: {
      type: Number,
      required: [true, "Beds is required."],
      min: [0, "Beds cannot be negative."],
    },

    baths: {
      type: Number,
      required: [true, "Baths is required."],
      min: [0, "Baths cannot be negative."],
    },

    squareFeet: {
      type: Number,
      required: [true, "Square feet is required."],
      validate: {
        validator: (v: number) => v > 1,
        message: "Square feet must be greater than 1.",
      },
    },
    propertyType: {
      type: String,
      enum: Object.values(PropertyType),
      required: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
      validate: {
        validator: (v: Date) => v.getTime() <= Date.now(),
        message: "Posted date cannot be in the future.",
      },
    },
    averageRating: { type: Number, default: 4.5, min: 0, max: 5 },
    numberOfReviews: { type: Number, default: 0, min: 0 },
    managerCognitoId: {
      type: String,
      required: [true, "Manager Cognito ID is required!"],
      index: true,
    },
    applications: [
      { type: Schema.Types.ObjectId, ref: "Application", default: [] },
    ],
    leases: [{ type: Schema.Types.ObjectId, ref: "Lease", default: [] }],
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: [true, "Location is required!"],
    },
    manager: {
      type: Schema.Types.ObjectId,
      ref: "Manager",
      required: [true, "Manager Mongo ID is required!"],
    },
    favoritedBy: [{ type: Schema.Types.ObjectId, ref: "Tenant", default: [] }],
    tenants: [{ type: Schema.Types.ObjectId, ref: "Tenant", default: [] }],
  },
  {
    timestamps: true,
  }
);

export const Property = model<IProperty>("Property", propertySchema);
