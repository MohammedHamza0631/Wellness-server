require("dotenv").config();
const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.RAILWAY_URL,
});

module.exports = pool;
