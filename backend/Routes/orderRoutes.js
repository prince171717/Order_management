import express from "express";
import { validationResult } from "express-validator";
import { uploader } from "../Utils/upload.js";
import { protect } from "../Middlewares/auth.js";
import { createOrder,
  getAllOrders,
  getOrderById,
  updateOrderQuantity,
  deleteOrder } from "../Controllers/orderController.js";
import { createOrderRules, updateQuantityRules } from "../Validators/orderValidator.js";

const router = express.Router();

// Public: create order (with image)
router.post(
  "/",
  uploader.single("productImage"),
  createOrderRules,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    next();
  },
  createOrder
);

// Admin protected
router.get("/", protect, getAllOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/quantity", protect, updateQuantityRules, (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
}, updateOrderQuantity);
router.delete("/:id", protect, deleteOrder);

export default router;
