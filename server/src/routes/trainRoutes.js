const express = require("express");

const {
    getTrains,
    searchTrains,
} = require("../controllers/trainController");

const router = express.Router();

router.get("/", getTrains);

router.get("/search", searchTrains);

module.exports = router;