import { PLANS } from "../config/plan.js";
import dotenv from "dotenv";
dotenv.config();
// billing.controller.js
export const razorpayWebhook = async (req, res) => {
    // Razorpay sends a secret header to verify the request is actually from them
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const signature = req.headers["x-razorpay-signature"];

    // Verify the webhook signature using crypto
    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(JSON.stringify(req.body))
        .digest("hex");

    if (signature === expectedSignature) {
        const event = req.body.event;

        if (event === "payment.captured") {
            const paymentData = req.body.payload.payment.entity;
            const userId = paymentData.notes.userId; // Retrieved from the 'notes' you sent during order creation
            const planType = paymentData.notes.planType;
            const plan = PLANS[planType];

            // Update database here as a backup
            await User.findByIdAndUpdate(userId, {
                $inc: { credits: plan.credits },
                $set: { plan: plan.plan }
            });
        }
        res.status(200).json({ status: "ok" });
    } else {
        res.status(400).json({ status: "invalid signature" });
    }
};