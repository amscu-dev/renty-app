import { Schema, Model, model } from "mongoose";
import { type ILocation } from "./location.interface";

const locationSchema: Schema<ILocation> = new Schema(
  {
    address: {
      type: String,
      required: [true, "A property must have a valid address."],
      trim: true,
      maxLength: [
        100,
        "Property address cannot have more than 100 characters.",
      ],
    },
    city: {
      type: String,
      required: [true, "A property must have a valid city."],
      trim: true,
      maxLength: [
        40,
        "Property city address cannot have more than 40 characters.",
      ],
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      required: [true, "A property must have a valid country."],
      trim: true,
      maxLength: [45, "Property country  cannot have more than 45 characters."],
      minLength: [3, "Property country  cannot have less than 3 characters."],
    },
    postalCode: {
      type: String,
      required: [true, "A property must have a valid postal code."],
    },
    properties: [{ type: Schema.Types.ObjectId, ref: "Property" }],
    coordinates: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // lng, lat
        required: true,
        validate: (v: number[]) => Array.isArray(v) && v.length === 2,
      },
    },
  },
  {
    timestamps: true,
  }
);

// Index for GeoSpatialQuery
locationSchema.index({ coordinates: "2dsphere" });

export const Location: Model<ILocation> = model("Location", locationSchema);
