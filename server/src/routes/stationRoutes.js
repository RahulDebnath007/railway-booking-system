const express = require("express");

const protect = require("../middleware/authMiddleware");
const admin = require("../middleware/adminMiddleware");

const {
    createStation,
    getStations,
} = require("../controllers/stationController");

const router = express.Router();

/*
 * ================================
 * PUBLIC ROUTE
 * ================================
 * Used by passenger Home page
 * to load stations for dropdowns.
 */
router.get(
    "/stations",
    getStations
);

/*
 * ================================
 * ADMIN ROUTES
 * ================================
 */

router.post(
    "/stations",
    protect,
    admin,
    createStation
);

module.exports = router;