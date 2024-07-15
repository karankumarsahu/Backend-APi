import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const connect = await mongoose.connect(process.env.MONGO_URL!);
    console.log(`Connected to MongoDB ${connect.connection.host}`);
  } catch (error: any) {
    console.log(`Error while connecting to MongoDB ${error}`);
  }
};

export default dbConnect;
