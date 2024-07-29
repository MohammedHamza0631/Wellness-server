const express = require("express");
const cors = require("cors");

const pool = require("./config/db");

const env = require("dotenv");
const app = express();

env.config();
const PORT = process.env.PORT || 5000;
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
    "Access-Control-Allow-Headers": "Content-Type, Set-Cookie, Authorization",
  })
);

// Start the DB Connection
pool.connect((err) => {
  if (err) {
    console.error("DB Connection Error:", err.stack);
    return;
  }
  console.log("Connected to DB");
});

app.get("/healthz", (req, res) => {
  res.status(200).json("Systems up & running");
});

// Register/ Login User
app.use("/api/auth", require("./routes/authRoutes"));

// Get all retreats
app.use("/api/retreats", require("./routes/retreatRoutes"));

// Booking Routes
app.use("/api/book", require("./routes/bookingRoutes"));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
