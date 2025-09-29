import jwt from "jsonwebtoken";
import Admin from "../Models/Admin.js";

const signToken = (admin) =>
  jwt.sign({ id: admin._id, email: admin.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });

export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await admin.comparePassword(password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    const token = signToken(admin);
    res.json({ token, admin: { email: admin.email, id: admin._id } });
  } catch (err) {
    next(err);
  }
};
