const express = require("express");
const router = express.Router();

const { getAllRetreats } = require("../controllers/retreatController");

router.get("/", getAllRetreats);

module.exports = router;