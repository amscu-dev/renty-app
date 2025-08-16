import { Types } from "mongoose";

export interface ILease {
  startDate: Date;
  endDate: Date;
  rent: number;
  deposit: number;
  tenantCognitoId: string;
  tenant: Types.ObjectId;
  property: Types.ObjectId;
  application?: Types.ObjectId;
  payments: Types.ObjectId[];
  nextPaymentDate?: Date;
}
export interface IPartialLeaseWithId extends Partial<ILease> {
  _id: Types.ObjectId;
}
