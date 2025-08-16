import { Schema, Model, model } from "mongoose";
import { type IManager } from "./manager.interface";

const managerSchema: Schema<IManager> = new Schema(
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
    managedProperties: [
      { type: Schema.Types.ObjectId, ref: "Property", default: [] },
    ],
  },
  {
    timestamps: true,
  }
);

export const Manager: Model<IManager> = model("Manager", managerSchema);
