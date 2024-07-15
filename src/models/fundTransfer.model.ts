import { Schema, model, Document } from "mongoose";

interface IFundTransfer extends Document {
  phoneNumber: string;
  merchantAmount: number;
  userAmount: number;
  commissionAmount: number;
  status: "pending" | "completed";
  createdAt: Date;
}

const fundTransferSchema = new Schema<IFundTransfer>({
  phoneNumber: { type: String, required: true },
  merchantAmount: { type: Number, required: true },
  userAmount: { type: Number, required: true },
  commissionAmount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

export default model<IFundTransfer>("FundTransfer", fundTransferSchema);
