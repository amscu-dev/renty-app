import { Types } from "mongoose";

export enum ApplicationStatus {
  Pending = "Pending",
  Denied = "Denied",
  Approved = "Approved",
}

export interface IApplication {
  applicationDate: Date;
  status: ApplicationStatus;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
  tenantCognitoId: string;
  lease: Types.ObjectId;
  property: Types.ObjectId;
  tenant: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPartialApplicationWithId extends Partial<IApplication> {
  _id: Types.ObjectId;
}
