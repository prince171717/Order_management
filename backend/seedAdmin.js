import dotenv from "dotenv";
import connectDB from "./Utils/db.js";
import Admin from "./Models/Admin.js";
dotenv.config();

await connectDB();

const run = async () => {
  try {
    const email = process.env.ADMIN_DEFAULT_EMAIL;
    const password = process.env.ADMIN_DEFAULT_PASSWORD;
    if (!email || !password) {
      console.log("Set ADMIN_DEFAULT_EMAIL & ADMIN_DEFAULT_PASSWORD in .env");
      process.exit(0);
    }
    const exists = await Admin.findOne({ email });
    if (exists) {
      console.log("Admin already exists:", email);
      process.exit(0);
    }
    await Admin.create({ email, password });
    console.log("Admin created:", email);
  } catch (e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
};

run();
