const mongoose = require("mongoose");

const trainSchema = new mongoose.Schema(
    {
        trainNumber: {
            type: String,
            required: [true, "Train number is required"],
            unique: true,
            trim: true,
        },

        name: {
            type: String,
            required: [true, "Train name is required"],
            trim: true,
        },

        source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: [true, "Source station is required"],
        },

        destination: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: [true, "Destination station is required"],
        },

        departureTime: {
            type: String,
            required: [true, "Departure time is required"],
        },

        arrivalTime: {
            type: String,
            required: [true, "Arrival time is required"],
        },

        duration: {
            type: String,
            required: [true, "Duration is required"],
        },

        runningDays: {
            type: [String],
            required: true,
            enum: [
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
            ],
        },

       classInventory: [
    {
        classCode: {
            type: String,
            enum: ["1A", "2A", "3A", "SL", "CC", "2S"],
            required: true,
        },

        totalSeats: {
            type: Number,
            required: true,
            min: 1,
        },

        fare: {
            type: Number,
            required: true,
            min: 0,
        },
    },
],
    },
    {
        timestamps: true,
    }
);

const Train = mongoose.model("Train", trainSchema);

module.exports = Train;