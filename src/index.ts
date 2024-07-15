import express from "express";
import dotenv from "dotenv";
import dbConnect from "./db/db.js";
import "./utils/fundTransferCron.js";

dotenv.config();

const app = express();

app.use(express.json());

import authRoutes from "./routes/auth.route.js";
import paymentRoutes from "./routes/payment.route.js";
import transferRoutes from "./routes/transfer.route.js";


app.use('/api/auth', authRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/transfer', transferRoutes);


app.get("/", (req, res) => res.send("Hello"));

dbConnect().then(() =>
  app.listen(process.env.PORT || 3000, () =>
    console.log("Server is running on port " + process.env.PORT || 3000)
  )
).catch((err) => console.log("Error while connecting to MongoDB and connecting to server" + err));
