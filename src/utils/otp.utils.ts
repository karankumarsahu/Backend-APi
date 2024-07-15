import userModel from "../models/user.model.js";

export const saveOtp = async (
  phoneNumber: string,
  otp: string
): Promise<void> => {
  try {
    const expiry = new Date(Date.now() + 10 * 60 * 1000);
    const existingUser = await userModel.findOne({ phoneNumber });    
    if (existingUser) {
      existingUser.otp = otp;
      existingUser.otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
      existingUser.isVerified = false;
      await existingUser.save();
      return;
    }
    const user = await userModel.create({
      phoneNumber,
      otp,
      otpExpiry: expiry,
    });
  } catch (error) {
    console.log(error);
  }
};

export const getOtp = async (phoneNumber: string): Promise<string | null> => {
  try {
    const user = await userModel.findOne({ phoneNumber });
    if (!user || user.otpExpiry < new Date()) {
      return null;
    }
    return user.otp;
  } catch (error) {
    console.error("Error retrieving OTP:", error);
    return null;
  }
};
