// ============================================
// app.js - Main Application with All Routes
// ============================================
const express = require("express");
const cors = require("cors");
const { db } = require("./config/database");
const { NotificationService } = require("./services/NotificationService");

// Import routes
const authRouter = require("./routes/auth");
const sessionRouter = require("./routes/sessions");
const feedbackRouter = require("./routes/feedback");
const reportRouter = require("./routes/reports");
const notificationRouter = require("./routes/notifications");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/sessions", sessionRouter);
app.use("/api/feedback", feedbackRouter);
app.use("/api/reports", reportRouter);
app.use("/api/notifications", notificationRouter);

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date(),
    service: "Tutor Support System API",
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Tutor Support System API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      sessions: "/api/sessions",
      feedback: "/api/feedback",
      reports: "/api/reports",
      notifications: "/api/notifications",
      health: "/health",
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Endpoint not found" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ error: "Something went wrong!", message: err.message });
});

const PORT = process.env.PORT || 8000;

// Initialize services and start server
async function startServer() {
  try {
    // Connect to database
    await db.connect();

    // Initialize notification service
    await NotificationService.initialize();

    // Schedule automatic reminders (every hour)
    setInterval(async () => {
      try {
        await NotificationService.scheduleReminders();
      } catch (error) {
        console.error("Error in scheduled reminders:", error);
      }
    }, 60 * 60 * 1000);

    app.listen(PORT, () => {
      console.log(`Tutor Support System API running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

module.exports = app;
