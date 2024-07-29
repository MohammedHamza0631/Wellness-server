const pool = require("../config/db"); // Assuming you have a pool module to handle database operations

const getRetreats = async (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const [retreats, totalCount] = await Promise.all([
      pool.query(
        "SELECT * FROM retreats ORDER BY date DESC LIMIT $1 OFFSET $2",
        [limit, offset]
      ),
      pool.query("SELECT COUNT(*) FROM retreats"),
    ]);

    res.json({
      retreats: retreats.rows,
      totalPages: Math.ceil(totalCount.rows[0].count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const searchRetreats = async (req, res) => {
  const { search, page = 1, limit = 5 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const searchTerm = `%${search}%`;

    const [retreats, totalCount] = await Promise.all([
      pool.query(
        `SELECT * FROM retreats 
           WHERE title ILIKE $1 
             OR description ILIKE $1 
             OR location ILIKE $1 
             OR tags::text ILIKE $1 
           ORDER BY date DESC 
           LIMIT $2 OFFSET $3`,
        [searchTerm, limit, offset]
      ),
      pool.query(
        `SELECT COUNT(*) FROM retreats 
           WHERE title ILIKE $1 
             OR description ILIKE $1 
             OR location ILIKE $1 
             OR tags::text ILIKE $1`,
        [searchTerm]
      ),
    ]);

    res.json({
      retreats: retreats.rows,
      totalPages: Math.ceil(totalCount.rows[0].count / limit),
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  getRetreats,
  searchRetreats,
};
