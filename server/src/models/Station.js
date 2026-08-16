const mongoose = require("mongoose");

const stationSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Station name is required"],
            trim: true,
            unique: true,
        },

        code: {
            type: String,
            required: [true, "Station code is required"],
            trim: true,
            uppercase: true,
            unique: true,
            minlength: 2,
            maxlength: 5,
        },

        city: {
            type: String,
            required: [true, "City is required"],
            trim: true,
        },

        state: {
            type: String,
            required: [true, "State is required"],
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

const Station = mongoose.model("Station", stationSchema);

module.exports = Station;