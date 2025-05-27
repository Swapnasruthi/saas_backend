// Simulate what Razorpay would do (in frontend)
const crypto = require("crypto");

const razorpay_order_id = "order_dummy123";
const razorpay_payment_id = "pay_dummy456";
const RAZORPAY_SECRET = "1234567890abcdef1234567890abcdef"; // Use .env secret

const body = `${razorpay_order_id}|${razorpay_payment_id}`;
const generated_signature = crypto
  .createHmac("sha256", RAZORPAY_SECRET)
  .update(body)
  .digest("hex");

console.log("Signature to use in Postman:", generated_signature);
