import { Types } from "mongoose";

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
