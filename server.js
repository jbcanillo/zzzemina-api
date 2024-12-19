import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import seminarRoutes from "./routes/seminarRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";

import { fileURLToPath } from 'url';

// Create equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
connectDB();

// CORS configuration
const corsOptions = {
  origin: "http://localhost:5173", // The origin of your frontend (adjust the port if necessary)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow cookies to be sent if needed
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

if (!process.env.JWT_SECRET_KEY) {
  console.error("JWT_SECRET_KEY is missing in the .env file");
}

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/seminars", seminarRoutes);
app.use("/api/bookings", bookingRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to Zzzmenia API!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
