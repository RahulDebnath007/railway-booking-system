const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
    {
        seatNumber: {
            type: String,
            required: true,
        },

        status: {
            type: String,
            enum: ["AVAILABLE", "BOOKED"],
            default: "AVAILABLE",
        },
    },
    {
        _id: false,
    }
);

const seatInventorySchema = new mongoose.Schema(
    {
        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Train",
            required: true,
        },

        journeyDate: {
            type: Date,
            required: true,
        },

        classCode: {
            type: String,
            enum: ["1A", "2A", "3A", "SL", "CC", "2S"],
            required: true,
        },

        seats: {
            type: [seatSchema],
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

seatInventorySchema.index(
    {
        train: 1,
        journeyDate: 1,
        classCode: 1,
    },
    {
        unique: true,
    }
);

const SeatInventory = mongoose.model(
    "SeatInventory",
    seatInventorySchema
);

module.exports = SeatInventory;