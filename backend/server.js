const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const pool = require("./config/db"); 
dotenv.config();

const authRoutes = require("./routes/authRoutes"); 

const app = express();

// Middleware Configuration
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/auth", authRoutes);

// Default root route
app.get("/", (req, res) => {
  res.send(" Welcome to ChefMate API");
});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
