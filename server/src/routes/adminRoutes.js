const express = require("express");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    createStation,
    getStations,
} = require("../controllers/stationController");

const {
    createTrain,
    getTrains,
} = require("../controllers/trainController");

const router = express.Router();


// =========================
// STATIONS
// =========================

// Get all stations
router.get(
    "/stations",
    protect,
    admin,
    getStations
);

// Create a station
router.post(
    "/stations",
    protect,
    admin,
    createStation
);


// =========================
// TRAINS
// =========================

// Get all trains
router.get(
    "/trains",
    protect,
    admin,
    getTrains
);

// Create a train
router.post(
    "/trains",
    protect,
    admin,
    createTrain
);


module.exports = router;