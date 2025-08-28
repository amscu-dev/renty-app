import { Types } from "mongoose";

export enum ApplicationStatus {
  Pending = "Pending",
  Denied = "Denied",
  Approved = "Approved",
}

export interface IApplication {
  applicationDate: string;
  status: ApplicationStatus;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string;
  tenantCognitoId: string;
  property: Types.ObjectId;
  lease: Types.ObjectId;
  tenant: Types.ObjectId;
  manager: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface IPartialApplicationWithId extends Partial<IApplication> {
  _id: Types.ObjectId;
}
