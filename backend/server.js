const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db"); // Keep this import for database connection confirmation

dotenv.config();

// Import badgeEngine to call initialization function
const { initializeBadgeMetadata } = require("./utils/badgeEngine"); // <--- NEW IMPORT

const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const badgesRoutes = require("./routes/badgesRoutes"); // Already correctly imported

const app = express();

// Apply Security Headers
app.use(helmet());

// Apply Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again after 15 minutes"
});
app.use(limiter);

// Other Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/badges", badgesRoutes); // Already correctly used

// Default root route
app.get("/", (req, res) => {
  res.send("Welcome to ChefMate API");
});

// Start Server
const PORT = process.env.PORT || 5000;

// Connect to database and then start server and initialize badge metadata
pool.connect() // This assumes pool.connect() returns a promise for connection
  .then(() => {
    console.log("Connected to PostgreSQL database successfully.");
    return initializeBadgeMetadata(); // <--- CRITICAL CALL: Initialize badge metadata
  })
  .then(() => {
    console.log("Badge metadata synchronized with database.");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("Failed to connect to database or initialize badge metadata:", err);
    process.exit(1); // Exit process if database connection or initialization fails
  });