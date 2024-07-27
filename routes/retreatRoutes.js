const express = require("express");
const router = express.Router();
const { getRetreats, searchRetreats } = require('../controllers/retreatController');

// Route to get all retreats with pagination
router.get('/', getRetreats);

// Route to search retreats with pagination
router.get('/search', searchRetreats);
module.exports = router;