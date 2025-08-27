import { HydratedDocument, PopulatedDoc, Types } from "mongoose";
import { ILease } from "../lease/lease.interface";

export enum PaymentStatus {
  Pending = "Pending",
  Paid = "Paid",
  PartiallyPaid = "PartiallyPaid",
  Overdue = "Overdue",
}

export interface IPayment {
  amountDue: number;
  amountPaid: number;
  dueDate: Date;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
  lease: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPartialPaymentWithId extends Partial<IPayment> {
  _id: string;
}
