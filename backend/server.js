
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const http = require("http");
const { Server } = require("socket.io");

require("dotenv").config();

const {
  authenticateToken,
  authorizeRoles
} = require("./middleware/authMiddleware");

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10kb" }));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later."
  }
});

app.use("/api", apiLimiter);

// Health check
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "HackHub API is running"
  });
});

// API routes
const hackathonRoutes = require("./routes/hackathonRoutes");
app.use("/api/hackathons", hackathonRoutes);

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

const registrationRoutes = require("./routes/registrationRoutes");
app.use("/api/registrations", registrationRoutes);

app.get("/api/auth/test", (req, res) => {
  res.json({
    success: true,
    message: "Auth route mount works"
  });
});

// Protected route: any logged-in user
app.get(
  "/api/auth/profile",
  authenticateToken,
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Authentication successful",
      user: req.user
    });
  }
);

// Admin-only test route
app.get(
  "/api/admin/test",
  authenticateToken,
  authorizeRoles("Admin"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Admin access granted",
      user: req.user
    });
  }
);

// Create HTTP server for Express and Socket.IO
const server = http.createServer(app);

// Build allowed origins list: local dev ports + your production FRONTEND_URL
const allowedOrigins = [
  "http://localhost:8088",
  "http://localhost:5173"
];

if (process.env.FRONTEND_URL) {
  // Supports single URL or comma-separated URLs, automatically stripping any trailing slash
  const envUrls = process.env.FRONTEND_URL.split(",").map((url) =>
    url.trim().replace(/\/+$/, "")
  );
  allowedOrigins.push(...envUrls);
}

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"]
  }
});

app.set("io", io);

// Announcements API routes
const announcementRoutes = require("./routes/announcementRoutes");
app.use("/api/announcements", announcementRoutes);

// Real-time announcement connections
io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.on("join-announcements", () => {
    socket.join("announcements");
    console.log("Client joined announcements:", socket.id);
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

// Connect to MongoDB before starting the server
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing from the .env file");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    server.listen(PORT, () => {
      console.log(`HackHub server running on port ${PORT}`);
      console.log("Socket.IO real-time communication enabled");
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);
    console.error("Error cause:", error.cause?.message);
    process.exit(1);
  }
}

startServer();

module.exports = { app, server, io };
