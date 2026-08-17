const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/database");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const stationRoutes = require("./routes/stationRoutes");
const trainRoutes = require("./routes/trainRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const seatInventoryRoutes = require("./routes/seatInventoryRoutes");
const adminRoutes = require("./routes/adminRoutes");
const publicStationRoutes = require("./routes/publicStationRoutes");

const app = express();

/* =========================================================
   CORS
   ========================================================= */

const allowedOrigins = [
    "http://localhost:5173",
    "https://railway-booking-system-flame.vercel.app",
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
    cors({
        origin: function (origin, callback) {
            // Allow requests without Origin
            // e.g. Postman / server-to-server
            if (!origin) {
                return callback(null, true);
            }

            // Allow explicitly configured origins
            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            // Allow Vercel deployment/preview URLs
            if (
                origin.endsWith(".vercel.app") &&
                origin.includes("railway-booking-system")
            ) {
                return callback(null, true);
            }

            console.log("Blocked CORS origin:", origin);

            return callback(
                new Error("Not allowed by CORS")
            );
        },

        credentials: true,
    })
);

/* =========================================================
   MIDDLEWARE
   ========================================================= */

app.use(express.json());

/* =========================================================
   DATABASE
   ========================================================= */

connectDB();

/* =========================================================
   ROUTES
   ========================================================= */

app.use("/api/auth", authRoutes);

app.use("/api/users", userRoutes);

app.use("/api/stations", stationRoutes);

app.use("/api/trains", trainRoutes);

app.use("/api/bookings", bookingRoutes);

app.use("/api/payments", paymentRoutes);

app.use("/api/seat-inventory", seatInventoryRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/stations", publicStationRoutes);

/* =========================================================
   HEALTH CHECK
   ========================================================= */

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Railway Booking API is running",
    });
});

/* =========================================================
   ERROR HANDLER
   ========================================================= */

app.use((err, req, res, next) => {
    console.error("Server error:", err.message);

    res.status(500).json({
        success: false,
        message: "Server error",
    });
});

/* =========================================================
   LOCAL DEVELOPMENT
   ========================================================= */

if (require.main === module) {
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(
            `Server running on http://localhost:${PORT}`
        );
    });
}

/* =========================================================
   VERCEL
   ========================================================= */

module.exports = app;