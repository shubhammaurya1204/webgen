import { PLANS } from "../config/plan.js";
import razorpay from "../config/razorpay.js";
import crypto from "crypto";
import User from "../models/user.model.js"; // Adjust based on your project

export const createOrder = async (req, res) => {
    try {
        const { planType } = req.body;
        const plan = PLANS[planType];

        if (!plan || plan.price === 0) {
            return res.status(400).json({ message: "Invalid paid plan" });
        }

        const options = {
            amount: plan.price * 100, // Razorpay expects amount in paise (499 INR = 49900 paise)
            currency: "INR",
            receipt: `receipt_${Date.now()}`,
            notes: {
                userId: req.user._id, // Metadata to track who bought it
                planType: planType
            }
        };

        const order = await razorpay.orders.create(options);
        
        // Return the order details to the frontend
        res.status(200).json({
            success: true,
            orderId: order.id,
            amount: order.amount,
            keyId: process.env.RAZORPAY_KEY_ID // Frontend needs this 
        });

    } catch (error) {
        console.error("Razorpay Order Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


export const verifyPayment = async (req, res) => {
    try {
        const { 
            razorpay_order_id, 
            razorpay_payment_id, 
            razorpay_signature,
            planType 
        } = req.body;

        const userId = req.user._id;

        // 1. Generate the signature to compare
        // Format: order_id + "|" + payment_id
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest("hex");

        // 2. Compare signatures
        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // 3. Logic to update database
            const plan = PLANS[planType];
            
            await User.findByIdAndUpdate(userId, {
                $inc: { credits: plan.credits }, // Increment user's credits
                $set: { plan: plan.plan }        // Update plan status
            });

            return res.status(200).json({
                success: true,
                message: "Payment verified and credits added successfully!"
            });
        } else {
            return res.status(400).json({
                success: false,
                message: "Signature mismatch. Payment verification failed."
            });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};