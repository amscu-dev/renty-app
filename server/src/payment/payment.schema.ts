import { model, Model, Schema } from "mongoose";
import { IPayment } from "./payment.interface";
import { PaymentStatus } from "./payment.interface";
const paymentSchema: Schema<IPayment> = new Schema(
  {
    amountDue: {
      type: Number,
      required: [true, "Amount due is required."],
      validate: {
        validator: (v: number) => v > 0,
        message: "Amount due must be greater than 0.",
      },
    },
    amountPaid: {
      type: Number,
      required: [true, "Amount paid is required."],
      min: [0, "Amount paid cannot be negative."],
      validate: {
        validator: function (this: IPayment, v: number) {
          if (typeof this.amountDue !== "number") return true;
          return v <= this.amountDue;
        },
        message: "Amount paid cannot exceed amount due.",
      },
    },

    dueDate: {
      type: Date,
      required: [true, "Due date is required."],
    },

    paymentDate: {
      type: Date,
      required: [true, "Payment date is required."],
    },

    paymentStatus: {
      type: String,
      required: [true, "Payment status is required."],
      enum: {
        values: Object.values(PaymentStatus),
        message: `Invalid payment status "{VALUE}". Allowed:
          ${Object.values(PaymentStatus).join(", ")}`,
      },
    },
    lease: {
      type: Schema.Types.ObjectId,
      ref: "Lease",
      required: [true, "Lease reference is required."],
    },
  },
  { timestamps: true }
);
export const Payment: Model<IPayment> = model("Payment", paymentSchema);
