import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
import fundTransferModel from '../models/fundTransfer.model.js';

// const SECRET_KEY = process.env.JWT_SECRET || 'your_jwt_secret';

interface TokenPayload {
  phoneNumber: string;
  iat: number;
  exp: number;
}

export const transferFunds = async (req: Request, res: Response) => {
  const { token, amount } = req.body;

  if (!token || !amount) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId);

    if (!user || !user.isVerified) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const merchantPercentage = parseFloat(process.env.MERCHANT_PERCENTAGE!);
    const userPercentage = parseFloat(process.env.USER_PERCENTAGE!);
    const commissionPercentage = parseFloat(process.env.COMMISSION_PERCENTAGE!);

    const merchantAmount = (amount * merchantPercentage) / 100;
    const userAmount = (amount * userPercentage) / 100;
    const commissionAmount = (amount * commissionPercentage) / 100;

    const transferData = new fundTransferModel({
      phoneNumber: user.phoneNumber,
      merchantAmount,
      userAmount,
      commissionAmount,
      status: 'pending'
    });

    await transferData.save();

    res.status(200).json({ message: 'Fund transfer initiated' });
  } catch (error) {
    console.error('Error in fund transfer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};
