import cookieParser from "cookie-parser";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import fs from "fs";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import musicRoute from "./routes/music.route.js";
import categoryRoute from "./routes/category.route.js";
import stripe from "./routes/stripe.route.js";
import membership from "./routes/membership.route.js";
import contactRoutes from "./routes/contact.route.js";
import ai from "./routes/ai.route.js";

dotenv.config();

mongoose.connect(process.env.MONGO)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('MongoDB connection failed:', err);
    process.exit(1);
  });

const app = express();
const corsOptions = {
  origin: 'http://localhost:5173',
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Serve static files from uploads folder
app.use("/uploads", express.static("/var/musicbible/Music-Bible/Frontend/uploads"));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "/var/musicbible/Music-Bible/Frontend/uploads"; // Update to your desired path
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// Upload route for images and music
app.post("/api/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }
  res.json({ success: true, fileUrl: `https://api.amusicbible.com/uploads/${req.file.filename}` });
});

app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/music", musicRoute);
app.use("/api/category", categoryRoute);
app.use("/api/stripe", stripe);
app.use("/api/membership", membership);
app.use("/api/contact", contactRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Backend is running successfully!" });
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({ success: false, message: err.message || "Internal Server Error" });
});

// Graceful Shutdown
process.on('SIGTERM', () => {
  console.log("Shutting down gracefully...");
  mongoose.connection.close(() => {
    console.log("Mongoose connection closed.");
    process.exit(0);
  });
});

app.listen(8080, '0.0.0.0', () => {
  console.log('Server running on port 8080');
});
