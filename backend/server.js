import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import cafeStatusRoutes from "./routes/cafeStatusRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import itemRoutes from "./routes/itemRoutes.js";
import tableRoutes from "./routes/tableRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import taxRoutes from "./routes/taxRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

/* ================== CORS FIX ================== */

// Allow local + deployed frontend + Vercel preview URLs
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.FRONTEND_URL, // your deployed frontend
];

// Smart CORS handler
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests like Postman or server-to-server
      if (!origin) return callback(null, true);

      // Allow exact match OR Vercel preview URLs
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } else {
        console.log("❌ Blocked by CORS:", origin);
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

// Handle preflight requests
app.options("*", cors());

/* ================== MIDDLEWARE ================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================== STATIC ================== */

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* ================== DATABASE ================== */

connectDB();

/* ================== ROUTES ================== */

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/taxes", taxRoutes);
app.use("/api/cafe-status", cafeStatusRoutes);

/* ================== HEALTH CHECK ================== */

app.get("/", (req, res) => {
  res.send("🚀 Restaurant API Running");
});

/* ================== ERROR HANDLER ================== */

app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

/* ================== SERVER ================== */

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on ports ${PORT}`);
  });
}

export default app;