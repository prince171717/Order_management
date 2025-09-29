import { body, param } from "express-validator";

export const createOrderRules = [
  body("customerName").isString().trim().isLength({ min: 3, max: 30 }),
  body("email").isEmail().normalizeEmail(),
  body("contactNumber").matches(/^\d{10}$/),
  body("shippingAddress").isString().trim().isLength({ min: 1, max: 100 }),
  body("productName").isString().trim().isLength({ min: 3, max: 50 }),
  body("quantity").isInt({ min: 1, max: 100 })
];

export const updateQuantityRules = [
  param("id").isMongoId(),
  body("quantity").isInt({ min: 1, max: 100 })
];
