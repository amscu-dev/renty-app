import { HydratedDocument, PopulatedDoc, Types } from "mongoose";
import { IProperty } from "../property/property.interface";

export interface IManager {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber?: string;
  managedProperties: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialManagerWithId extends Partial<IManager> {
  _id: Types.ObjectId;
}
