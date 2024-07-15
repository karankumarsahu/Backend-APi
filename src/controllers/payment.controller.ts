import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const processPayment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { token, amount } = req.body;

  if (!token || !amount) {
    res
      .status(400)
      .json({ message: "All fields are required", success: false });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({ message: "Unauthorized", success: false });
      return;
    }

    const merchantPercentage = parseFloat(process.env.MERCHANT_PERCENTAGE!);
    const userPercentage = parseFloat(process.env.USER_PERCENTAGE!);
    const commissionPercentage = parseFloat(process.env.COMMISSION_PERCENTAGE!);

    const merchantAmount = (amount * merchantPercentage) / 100;
    const userAmount = (amount * userPercentage) / 100;
    const commissionAmount = (amount * commissionPercentage) / 100;

    // After this we can use the payment info to process the payment

    res
      .status(200)
      .json({
        message: "Payment processed",
        success: true,
        merchantAmount,
        userAmount,
        commissionAmount,
      });
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};
