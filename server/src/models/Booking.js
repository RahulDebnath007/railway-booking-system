const mongoose = require("mongoose");

const passengerSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Passenger name is required"],
            trim: true,
            maxlength: 50,
        },

        age: {
            type: Number,
            required: [true, "Passenger age is required"],
            min: 1,
            max: 120,
        },

        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: [true, "Passenger gender is required"],
        },

        seatNumber: {
            type: String,
            default: null,
        },
    },
    {
        _id: true,
    }
);

const bookingSchema = new mongoose.Schema(
    {
        pnr: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        train: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Train",
            required: true,
        },

        journeyDate: {
            type: Date,
            required: true,
        },

        from: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },

        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Station",
            required: true,
        },

        classCode: {
            type: String,
            enum: ["1A", "2A", "3A", "SL", "CC", "2S"],
            required: true,
        },

        passengers: {
            type: [passengerSchema],
            required: true,
            validate: {
                validator: function (passengers) {
                    return passengers.length > 0 && passengers.length <= 6;
                },
                message: "Booking must contain between 1 and 6 passengers",
            },
        },

        totalFare: {
            type: Number,
            required: true,
            min: 0,
        },

        bookingStatus: {
            type: String,
            enum: [
                "CONFIRMED",
                "CANCELLED",
                "PENDING",
            ],
            default: "PENDING",
        },

        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED",
                "REFUNDED",
            ],
            default: "PENDING",
        },
    },
    {
        timestamps: true,
    }
);

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;