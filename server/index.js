// creating a server
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import authRouter from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRouter from "./routes/user.routes.js";
import websiteRouter from "./routes/website.route.js";
import billingRouter from "./routes/billing.routes.js";
import { razorpayWebhook } from "./controller/razorpayWebhook.controller.js";
const port = process.env.PORT || 5000;
const app = express(); // app -> Instence
app.post("/api/razorpay/webhook",express.raw({type:"application/json"}),razorpayWebhook)
app.use(cors({
    origin: "http://localhost:5173",
    credentials:true
}))
app.use(express.json()); // convert client data in json
app.use(cookieParser()); // helps to parse cookie
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/website", websiteRouter);
app.use("/api/billing", billingRouter);
app.listen(port,()=>{
    console.log("SERVER STARTED");
    connectDB();
})
