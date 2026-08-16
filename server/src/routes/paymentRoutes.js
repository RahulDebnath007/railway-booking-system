const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    processPayment,
} = require("../controllers/paymentController");

const router = express.Router();

router.post("/process", protect, processPayment);

module.exports = router;