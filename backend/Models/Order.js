import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true, minlength: 3, maxlength: 30, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    contactNumber: { type: String, required: true }, // store as string to preserve leading zeros
    shippingAddress: { type: String, required: true, maxlength: 100 },
    productName: { type: String, required: true, minlength: 3, maxlength: 50, trim: true },
    quantity: { type: Number, required: true, min: 1, max: 100 },
    productImageUrl: { type: String }, // /uploads/... relative URL
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
