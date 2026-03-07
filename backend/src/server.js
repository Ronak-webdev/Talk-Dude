import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";

import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import chatRoutes from "./routes/chat.route.js";

import { connectDB } from "./lib/db.js";

import { app, server } from "./lib/socket.js";

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
  "https://talk-dude-2.onrender.com",
  "https://talk-dude-3.onrender.com",
  "https://talk-dude-4.onrender.com",
  "http://192.168.1.9:5173",
  "http://192.168.117.32:5173"
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);

    // Allow explicitly listed origins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow all Vercel subdomains
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Block other origins
    console.error(`CORS blocked for: ${origin}`);
    return callback(new Error("Not allowed by CORS"), false);
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "Accept",
    "x-auth-token",
    "X-Requested-With"
  ],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// -------------------------------------------------- //

app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.path} - Origin: ${req.headers.origin}`
  );
  next();
});

import { clerkMiddleware } from "@clerk/express";

app.use(express.json());
app.use(cookieParser());
app.use(clerkMiddleware());

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  connectDB();
});
