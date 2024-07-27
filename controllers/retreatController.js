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

// Get retreat by search
exports.getRetreatBySearch = async (req, res) => {
  try {
    const { search } = req.query;
      const searchTerm = `%${search}%`;
    const retreats = await pool.query(
      `SELECT * FROM retreats 
           WHERE title ILIKE $1 
           OR description ILIKE $1 
           OR location ILIKE $1
           OR CONDITION ILIKE $1
           OR tags::text ILIKE $1`,
      [searchTerm]
    );
    res.status(200).json(retreats.rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
