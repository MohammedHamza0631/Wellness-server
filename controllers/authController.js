const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { username, email, password, phone } = req.body;

  try {
    // Check if user exists, check by email or username both
    const user = await pool.query(
      "SELECT * FROM users WHERE username = $1 OR email = $2",
      [username, email]
    );

    if (user.rows.length > 0) {
      return res
        .status(401)
        .json({ message: "User with same email exist, Please choose a different email or Login" });
    }

    // Encrypt user password
    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(password, salt);

    // Save user to database
    const newUser = await pool.query(
      "INSERT INTO users (username, email, phone_number, password) VALUES ($1, $2, $3, $4) RETURNING *",
      [username, email, phone, bcryptPassword]
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
      return res.status(401).json({ message: "No User Exists! Create One" });
    }

    // Check if password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].password);

    if (!validPassword) {
      return res.status(401).json({ message: "Wrong Password" });
    }

    // Create token
    jwt.sign({ user: user.rows[0] }, process.env.JWT_SECRET, (err, token) => {
      if (err) throw err;
      // send only id, username, email and token
      res.status(200).json({
        id: user.rows[0].id,
        username: user.rows[0].username,
        email: user.rows[0].email,
        phone: user.rows[0].phone_number,
        token,
      });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Login error" });
  }
};
