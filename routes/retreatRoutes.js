const express = require("express");
const router = express.Router();
const { getRetreatBySearch } = require("../controllers/retreatController");
const { getAllRetreats } = require("../controllers/retreatController");

router.get("/", getAllRetreats);
// controller for get retreat by search
router.get("/search", getRetreatBySearch);
module.exports = router;