import { Request, Response } from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { getOtp, saveOtp } from "../utils/otp.utils.js";

export const generateOtp = async (req: Request, res: Response) => {
  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!
  );
  const { phoneNumber } = req.body;

  if (!phoneNumber)
    return res
      .status(400)
      .json({ success: false, message: "Phone number is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  try {
    await client.messages.create({
      body: `Your OTP is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
      to: `+91${phoneNumber}`,
    });

    await saveOtp(phoneNumber, otp);

    res.status(200).json({ success: true, message: "OTP sent" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: `Error ${error}` });
  }
};

export const verifyOtp = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;

    if (!phoneNumber || !otp)
      return res
        .status(400)
        .json({ success: false, message: "Phone number and OTP are required" });

    const validOtp = await getOtp(phoneNumber);

    if (otp === validOtp) {
      let user = await User.findOne({ phoneNumber });
      if (!user) {
        user = new User({ phoneNumber });
        await user.save();
      }
      user.isVerified = true;
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
        expiresIn: "1h",
      });

      res.status(200).json({ token, success: true, message: "OTP verified" });
    } else {
      res.status(400).send("Invalid OTP");
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: `Error ${error}` });
  }
};
