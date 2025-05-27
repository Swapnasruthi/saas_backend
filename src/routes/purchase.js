const express = require("express");
const router = express.Router();
const razorpay = require("../config/razorpay");
const Subscription = require("../models/Subscription");
const crypto = require("crypto");
require("dotenv").config();
router.use(express.json());
router.use(express.urlencoded({ extended: true }));



router.post("/checkout", async (req, res) => {
  try {
    const { amount, planid } = req.body;
    const options = {
      amount: amount * 100,
      currency: "INR",
      receipt: `receipt_order_${Math.random()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json({ order });
  } catch (err) {
    console.error("Error during checkout:", err);
    res.status(500).json({
      success: false,
      message: "Failed to process checkout",
    });
  }
});

router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      planId,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET_KEY)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      const subscription = new Subscription({
        userId,
        planId,
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
        amount,
        status: "Active",
      });

      await subscription.save();
      res.status(200).json({ message: "Payment verified", subscription });
    } else {
      console.log("Expected:", expectedSignature);
      console.log("Received:", razorpay_signature);

      res.status(400).json({ message: "Invalid signature" });
    }
  } catch (err) {
    console.error("Error during payment verification:", err);
    res.status(500).json({
      success: false,
      message: "Failed to verify payment",
    });
  }
});

module.exports = router;
