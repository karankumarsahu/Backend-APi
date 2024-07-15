import express from "express";
import { transferFunds } from "../controllers/transfer.controller.js";

const router = express.Router();

router.post('/transfer-funds', transferFunds);

export default router;