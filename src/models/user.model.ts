import { Schema, model } from "mongoose";

interface IUser {
  phoneNumber: string,
  otp: string,
  otpExpiry: Date,
  isVerified: boolean,
}

const userSchema = new Schema<IUser>({
  phoneNumber: { type: String, required: true, unique: true },
  otp: { type: String, required: true },
  otpExpiry: { type: Date, required: true },
  isVerified: { type: Boolean, default: false }  
});

export default model<IUser>("User", userSchema);
