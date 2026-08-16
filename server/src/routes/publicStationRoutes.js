const express = require("express");

const {
    getStations,
} = require("../controllers/stationController");

const router = express.Router();

// Public station list
router.get("/", getStations);

module.exports = router;