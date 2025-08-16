import { Types } from "mongoose";

export interface ITenant {
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
  applications: Types.ObjectId[];
  leases: Types.ObjectId[];
  favorites: Types.ObjectId[];
  properties: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialTentantWithId extends Partial<ITenant> {
  _id: Types.ObjectId;
}
