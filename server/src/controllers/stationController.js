const Station = require("../models/Station");

const createStation = async (req, res) => {
    try {
        const { name, code, city, state } = req.body;

        if (!name || !code || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "All station fields are required",
            });
        }

        const existingStation = await Station.findOne({
            $or: [
                { name },
                { code: code.toUpperCase() },
            ],
        });

        if (existingStation) {
            return res.status(409).json({
                success: false,
                message: "Station already exists",
            });
        }

        const station = await Station.create({
            name,
            code,
            city,
            state,
        });

        res.status(201).json({
            success: true,
            message: "Station created successfully",
            station,
        });
    } catch (error) {
        console.error("Create station error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getStations = async (req, res) => {
    try {
        const stations = await Station.find().sort({ name: 1 });

        res.status(200).json({
            success: true,
            count: stations.length,
            stations,
        });
    } catch (error) {
        console.error("Get stations error:", error.message);

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
    createStation,
    getStations,
};