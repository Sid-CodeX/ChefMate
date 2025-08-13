const dns = require("dns");
dns.setDefaultResultOrder("ipv4first"); // Force IPv4 over IPv6

const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const pool = require("./config/db");
const redisClient = require("./utils/redisClient");

const authRoutes = require("./routes/authRoutes");
const favoritesRoutes = require("./routes/favoritesRoutes");
const recipesRoutes = require("./routes/recipesRoutes");
const aiRoutes = require("./routes/aiRoutes");
const mealPlannerRoutes = require('./routes/mealPlannerRoutes'); 
const gamificationRoutes = require('./routes/gamificationRoutes');

dotenv.config();

const app = express();

// Security & middleware
app.use(helmet());
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15-minute window
    max: 100, // max requests per window
    message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/favorites", favoritesRoutes);
app.use("/api/recipes", recipesRoutes);
app.use("/api/ai", aiRoutes);
app.use('/api/planner', mealPlannerRoutes);
app.use("/api/gamification", gamificationRoutes);

// Health check route
app.get("/", (req, res) => {
    res.send("Welcome to ChefMate API!");
});

// Server start
const PORT = process.env.PORT || 5000;

(async () => {
    try {
        // Supabase PostgreSQL connection
        await pool.connect();
        await pool.connect();
        console.log("Connected to Supabase PostgreSQL");

        // Connect to Redis
        await redisClient.connect();
        console.log("Connected to Redis");

        app.listen(PORT, () => {
            console.log(`Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("Startup failed:", err);
        process.exit(1);
    }
})();