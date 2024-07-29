const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [
      username,
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exists, PLease login");
    }

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
      [username, email, bcryptPassword]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Register error" });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if user exists
    const user = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: "USER DNE! Create One" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    // Create token
    jwt.sign({ user: user.rows[0] }, process.env.JWT_SECRET, (err, token) => {
        if (err) throw err;
        // send only id, username and token
        res.status(200).json({
          id: user.rows[0].id,
          username: user.rows[0].username,
          token,
        });
      });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Login error" });
  }
};
