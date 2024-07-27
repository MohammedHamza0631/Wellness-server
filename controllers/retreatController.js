const pool = require("../config/db");

// Get all retreats
exports.getAllRetreats = async (req, res) => {
  try {
    const allRetreats = await pool.query("SELECT * FROM retreats");
    res.status(200).json(allRetreats.rows);
  } catch (err) {
    res.status(500).json(err.message);
  }
};