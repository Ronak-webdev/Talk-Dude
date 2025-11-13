import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

const app = express();
const PORT = process.env.PORT;

const __dirname = path.resolve();

// ---------------- CORS FIXED HERE ---------------- //

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://talktribebyvp.vercel.app",
  "https://talktribe.vercel.app",
  "https://talk-dude.vercel.app",
  "https://talk-dude-2.onrender.com"
];

const corsOptions = {
  origin: (origin, callback) => {
    console.log("CORS Origin Check:", origin);

    // Allow requests with NO ORIGIN (mobile apps, backend-to-backend, curl)
    if (!origin) return callback(null, true);

    // ALLOW ANY VERCEL DEPLOYMENT (Preview + Production)
    if (origin.endsWith(".vercel.app")) {
      console.log("Allowed Vercel Origin:", origin);
      return callback(null, true);
    }

    // Normal explicit whitelist
    if (allowedOrigins.includes(origin)) {
      console.log("Explicitly Allowed Origin:", origin);
      return callback(null, true);
    }

    // Block everything else
    const msg = `CORS BLOCKED: ${origin} NOT allowed.`;
    console.error(msg);
    return callback(new Error(msg), false);
  },

  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "x-auth-token",
    "X-Requested-With"
  ],
  exposedHeaders: ["Content-Range", "X-Content-Range"],
  maxAge: 600
};

// Apply CORS
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// -------------------------------------------------- //

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`
  );
  next();
});

app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
