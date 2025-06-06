const mongoose = require("mongoose");



const SubscriptionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  planId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Plan", 
    required: true },
  purchaseDate: { type: Date },
  expiryDate: Date,
  status: { type: String, enum: ["Active", "Expired"], default: "Active" },
  amountPaid: Number,
});

module.exports = mongoose.model("Subscription", SubscriptionSchema);
