const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    createBooking,
    getMyBookings,
     getBookingByPNR,
     cancelBooking,
} = require("../controllers/bookingController");

const router = express.Router();

router.post("/", protect, createBooking);

router.get("/my-bookings", protect, getMyBookings);

router.get("/:pnr", protect, getBookingByPNR);

router.delete("/:pnr", protect, cancelBooking);

module.exports = router;