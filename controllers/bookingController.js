const pool = require("../config/db");

exports.bookRetreat = async (req, res) => {
  const {
    user_id,
    user_name,
    user_email,
    user_phone,
    payment_details,
    booking_date,
  } = req.body;
  //   console.log(req.body);
  const { retreatId } = req.params;
  try {
    const retreat = await pool.query("SELECT * FROM retreats WHERE id = $1", [
      retreatId,
    ]);

    if (retreat.rows.length === 0) {
      return res.status(404).json({ message: "Retreat not found" });
    }

    // Check if that user has already booked that retreat
    const booking = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1 AND retreat_id = $2",
      [user_id, retreatId]
    );

    if (booking.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "You have already booked this retreat" });
    }

    const {
      title: retreat_title,
      location: retreat_location,
      price: retreat_price,
      duration: retreat_duration,
    } = retreat.rows[0];

    const newBooking = await pool.query(
      "INSERT INTO bookings (user_id, user_name, user_email, user_phone, retreat_id, retreat_title, retreat_location, retreat_price, retreat_duration, payment_details, booking_date) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *",
      [
        user_id,
        user_name,
        user_email,
        user_phone,
        retreatId,
        retreat_title,
        retreat_location,
        retreat_price,
        retreat_duration,
        payment_details,
        booking_date,
      ]
    );

    res.status(201).json(newBooking.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Booking error" });
  }
};

exports.getBookedRetreats = async (req, res) => {
  const { userId } = req.params;
  try {
    const bookings = await pool.query(
      "SELECT * FROM bookings WHERE user_id = $1",
      [userId]
    );

    res.status(200).json(bookings.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Booking error" });
  }
};
