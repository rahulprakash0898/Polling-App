require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const pollRoutes = require("./routes/pollRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

// Initialize Database connection
connectDB();

// API Health Check
app.get("/", (req, res) => {
    res.status(200).json({
        name: "Polling-App API",
        version: "1.0.0",
        status: "Active & Healthy"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({ status: "OK", timestamp: new Date() });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/poll", pollRoutes);
app.use("/api/upload", uploadRoutes);

// Optional static uploads folder (fallback if local storage is used)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5000;

if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
    app.listen(PORT, () => console.log(`Polling-App Server running on port ${PORT}`));
}

module.exports = app;