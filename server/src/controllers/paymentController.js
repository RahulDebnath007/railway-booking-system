const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Train = require("../models/Train");

const processPayment = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { bookingId, paymentMethod } = req.body;

        if (!bookingId || !paymentMethod) {
            return res.status(400).json({
                success: false,
                message: "Booking ID and payment method are required",
            });
        }

        const allowedMethods = [
            "UPI",
            "CARD",
            "NET_BANKING",
        ];

        if (!allowedMethods.includes(paymentMethod)) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment method",
            });
        }

        let updatedBooking;

        await session.withTransaction(async () => {
            const booking = await Booking.findOne({
                _id: bookingId,
                user: req.user.userId,
            }).session(session);

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.bookingStatus === "CANCELLED") {
                throw new Error(
                    "Cannot pay for a cancelled booking"
                );
            }

            if (booking.paymentStatus === "PAID") {
                throw new Error(
                    "Payment has already been completed"
                );
            }

            /*
             * Mock payment:
             * We simulate a successful payment.
             */
            booking.paymentStatus = "PAID";
            booking.bookingStatus = "CONFIRMED";

            await booking.save({ session });

            updatedBooking = booking;
        });

        res.status(200).json({
            success: true,
            message: "Payment successful",
            paymentMethod,
            paymentStatus: "PAID",
            bookingStatus: "CONFIRMED",
            booking: updatedBooking,
        });
    } catch (error) {
        console.error(
            "Payment error:",
            error.message
        );

        res.status(400).json({
            success: false,
            message: error.message,
        });
    } finally {
        await session.endSession();
    }
};

module.exports = {
    processPayment,
};