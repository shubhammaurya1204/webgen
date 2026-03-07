import express from "express";
import { createOrder, verifyPayment } from "../controller/billing.controller.js";
import isAuth from "../middlewares/isAuth.js";

const billingRouter = express.Router();

// Route to create a new Razorpay order
// POST /api/billing/create-order
billingRouter.post("/create-order", isAuth, createOrder);

// Route to verify the payment signature and update credits
// POST /api/billing/verify-payment
billingRouter.post("/verify-payment", isAuth, verifyPayment);

export default billingRouter;