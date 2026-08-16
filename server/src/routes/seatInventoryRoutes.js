const express = require("express");

const protect = require("../middleware/authMiddleware");

const {
    initializeSeatInventory,
    getSeatInventory,
    resetSeatInventory,
} = require("../controllers/seatInventoryController");

const router = express.Router();

router.post(
    "/initialize",
    protect,
    initializeSeatInventory
);

router.get(
    "/",
    getSeatInventory
);


router.post(
    "/reset",
    resetSeatInventory
);

module.exports = router;