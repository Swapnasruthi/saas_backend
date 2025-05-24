const mongoose = require("mongoose");

const PlanSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  name: {
    type: String,
    enum: ["Basic", "Advanced", "Premium"],
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  featuresCount: Number,
  features: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Plan", PlanSchema);
