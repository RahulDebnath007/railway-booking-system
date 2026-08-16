const SeatInventory = require("../models/SeatInventory");
const Train = require("../models/Train");

const initializeSeatInventory = async (req, res) => {
    try {
        const {
            trainId,
            journeyDate,
            classCode,
        } = req.body;

        if (!trainId || !journeyDate || !classCode) {
            return res.status(400).json({
                success: false,
                message:
                    "Train ID, journey date and class are required",
            });
        }

        const train = await Train.findById(trainId);

        if (!train) {
            return res.status(404).json({
                success: false,
                message: "Train not found",
            });
        }

        const normalizedClass = classCode.toUpperCase();

        const classInfo = train.classInventory.find(
            (item) =>
                item.classCode === normalizedClass
        );

        if (!classInfo) {
            return res.status(400).json({
                success: false,
                message:
                    "Selected class is not available on this train",
            });
        }

        const existingInventory =
            await SeatInventory.findOne({
                train: trainId,
                journeyDate: new Date(journeyDate),
                classCode: normalizedClass,
            });

        if (existingInventory) {
            return res.status(409).json({
                success: false,
                message:
                    "Seat inventory already exists for this journey",
            });
        }

        const seats = [];

        for (
            let i = 1;
            i <= classInfo.totalSeats;
            i++
        ) {
            seats.push({
                seatNumber: `${normalizedClass}-${String(
                    i
                ).padStart(2, "0")}`,
                status: "AVAILABLE",
            });
        }

        const inventory = await SeatInventory.create({
            train: trainId,
            journeyDate: new Date(journeyDate),
            classCode: normalizedClass,
            seats,
        });

        res.status(201).json({
            success: true,
            message:
                "Seat inventory initialized successfully",
            inventory,
        });
    } catch (error) {
        console.error(
            "Initialize seat inventory error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getSeatInventory = async (req, res) => {
    try {
        const {
            trainId,
            journeyDate,
            classCode,
        } = req.query;

        if (!trainId || !journeyDate || !classCode) {
            return res.status(400).json({
                success: false,
                message:
                    "Train ID, journey date and class are required",
            });
        }

        const inventory =
            await SeatInventory.findOne({
                train: trainId,
                journeyDate: new Date(journeyDate),
                classCode: classCode.toUpperCase(),
            }).populate(
                "train",
                "trainNumber name"
            );

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message: "Seat inventory not found",
            });
        }

        const availableSeats =
            inventory.seats.filter(
                (seat) => seat.status === "AVAILABLE"
            ).length;

        const bookedSeats =
            inventory.seats.filter(
                (seat) => seat.status === "BOOKED"
            ).length;

        res.status(200).json({
            success: true,
            train: inventory.train,
            journeyDate: inventory.journeyDate,
            classCode: inventory.classCode,
            totalSeats: inventory.seats.length,
            availableSeats,
            bookedSeats,
            seats: inventory.seats,
        });
    } catch (error) {
        console.error(
            "Get seat inventory error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const resetSeatInventory = async (req, res) => {
    try {
        const {
            trainId,
            journeyDate,
            classCode,
        } = req.body;

        const inventory =
            await SeatInventory.findOne({
                train: trainId,
                journeyDate: new Date(journeyDate),
                classCode: classCode.toUpperCase(),
            });

        if (!inventory) {
            return res.status(404).json({
                success: false,
                message:
                    "Seat inventory not found",
            });
        }

        inventory.seats.forEach((seat) => {
            seat.status = "AVAILABLE";
        });

        await inventory.save();

        res.status(200).json({
            success: true,
            message:
                "Seat inventory reset successfully",
        });
    } catch (error) {
        console.error(
            "Reset seat inventory error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};
module.exports = {
    initializeSeatInventory,
    getSeatInventory,
    resetSeatInventory,
};