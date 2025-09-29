import { validationResult } from "express-validator";
import Order from "../Models/Order.js";

export const createOrder = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const payload = req.body;
    const productImageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

    const order = await Order.create({ ...payload, productImageUrl });

    // Emit real-time event
    req.app.get("io").emit("order:new", order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const { productName, startDate, endDate } = req.query;

    const filter = {};
    if (productName) filter.productName = { $regex: productName, $options: "i" };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const orders = await Order.find(filter).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const updateOrderQuantity = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.quantity = req.body.quantity;
    await order.save();

    req.app.get("io").emit("order:updated", order);
    res.json(order);
  } catch (err) {
    next(err);
  }
};

export const deleteOrder = async (req, res, next) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    req.app.get("io").emit("order:deleted", { id: req.params.id });
    res.json({ message: "Order deleted" });
  } catch (err) {
    next(err);
  }
};
