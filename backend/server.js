// server.js or index.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db");
const { initializeBadgeMetadata } = require("./utils/badgeEngine");

const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const badgesRoutes = require("./routes/badgesRoutes");
const recipesRoutes = require("./routes/recipesRoutes");

dotenv.config();

const app = express();

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min window
  max: 100, // max requests per window
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/badges", badgesRoutes);
app.use("/api/recipes", recipesRoutes);

// Health check route
app.get("/", (req, res) => {
  res.send("Welcome to ChefMate API!");
});

// Server start
const PORT = process.env.PORT || 5000;

(async () => {
  try {
    await pool.connect(); // Supabase PostgreSQL connection
    console.log("Connected to Supabase PostgreSQL");

    await initializeBadgeMetadata(); // Initialize badge metadata
    console.log("Badge metadata initialized");

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Startup failed:", err);
    process.exit(1);
  }
})();
