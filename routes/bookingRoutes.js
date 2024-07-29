const express = require("express");
const router = express.Router();
const {
  bookRetreat,
  getBookedRetreats,
} = require("../controllers/bookingController");

router.post("/:retreatId", bookRetreat);
router.get("/:userId", getBookedRetreats);

module.exports = router;
