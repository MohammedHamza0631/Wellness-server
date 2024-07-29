const pool = require("../config/db");

/*- `POST /book`: Create a new booking.
   - Request Body: `{ user_id, user_name, user_email, user_phone, retreat_id, retreat_title, retreat_location, retreat_price, retreat_duration, payment_details, booking_date }`
*/
// Front end code snippet
// const bookRetreat = async () => {
//     if (!loggedIn) {
//       alert('Please login to book a retreat');
//       return;
//     }
//     try {
//       const response = await axios.post(
//         'http://localhost:5000/api/book',
//         {
//           user_id: user?.id,
//           user_name: user?.name,
//           user_email: user?.email,
//           user_phone: user?.phone,
//           retreat_id: retreats[0].id,
//           retreat_title: retreats[0].title,
//           retreat_location: retreats[0].location,
//           retreat_price: retreats[0].price,
//           retreat_duration: retreats[0].duration,
//           payment_details: 'Credit Card',
//           booking_date: new Date().toISOString()
//         },
//         {
//           headers: {
//             'Content-Type': 'application/json'
//           },
//         },
//       );
//       console.log(response.data);
//       if (response.status !== 201) {
//         const errorData = response.data;
//         throw new Error(errorData.error || 'Booking Failed')
//       } else {
//         alert('Booking Successful');
//       }
//     } catch (error) {
//       console.error('Booking Error:', error)
//       const errorMessage = axios.isAxiosError(error) && error.response?.data.message
//         ? error.response.data.message
//         : (error as Error).message;
//       alert(`Booking Error: ${errorMessage}`);
//     }
//   };
// table schemas
// CREATE TABLE users (
//     id SERIAL PRIMARY KEY,
//     username VARCHAR(255) UNIQUE,
//     email VARCHAR(255) UNIQUE,
//     password VARCHAR(255) NOT NULL,
//     phone_number VARCHAR(20),
//     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
// );

// CREATE TABLE retreats (
//     id SERIAL PRIMARY KEY,
//     title VARCHAR(255) NOT NULL,
//     description TEXT,
//     date TIMESTAMP NOT NULL,
//     location VARCHAR(255),
//     price DECIMAL(10, 2),
//     type VARCHAR(50),
//     condition VARCHAR(100),
//     image TEXT,
//     duration INT,
//     tags TEXT[]
// );

// CREATE TABLE bookings (
//     id SERIAL PRIMARY KEY,
//     user_id INT NOT NULL REFERENCES users(id),
//     user_name VARCHAR(255),
//     user_email VARCHAR(255),
//     user_phone VARCHAR(20),
//     retreat_id INT REFERENCES retreats(id),
//     retreat_title VARCHAR(255),
//     retreat_location VARCHAR(255),
//     retreat_price DECIMAL(10, 2),
//     retreat_duration INT,
//     payment_details TEXT,
//     booking_date TIMESTAMP NOT NULL,
//     UNIQUE(user_id, retreat_id) -- Ensures a user cannot book the same retreat multiple times
// );

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
