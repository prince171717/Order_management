import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import { Server as SocketIOServer } from "socket.io";
import connectDB from "./Utils/db.js";
import authRoutes from "./Routes/authRoutes.js";
import orderRoutes from "./Routes/orderRoutes.js";
import { errorHandler, notFound } from "./Middlewares/error.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.CLIENT_ORIGIN || "*",
    methods: ["GET", "POST", "PATCH", "DELETE"]
  }
});

// Expose io to routes/controllers via app locals
app.set("io", io);

// Middlewares
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "*", credentials: true }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Static: uploaded images
const uploadDir = path.join(__dirname, process.env.UPLOAD_DIR || "uploads");
app.use("/uploads", express.static(uploadDir));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ ok: true }));

// Errors
app.use(notFound);
app.use(errorHandler);

// Socket
io.on("connection", (socket) => {
  // optionally auth room join, etc.
  socket.on("disconnect", () => {});
});

const PORT = process.env.PORT || 5000;

const startServer = async()=>{
  try {
    await connectDB()
    app.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.log("Error in startserver",error);
    
  }
}

startServer()