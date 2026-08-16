const mongoose = require("mongoose");
const Booking = require("../models/Booking");
const Train = require("../models/Train");
const SeatInventory = require("../models/SeatInventory");

const generatePNR = () => {
    return Math.floor(
        1000000000 + Math.random() * 9000000000
    ).toString();
};

const createBooking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const {
            trainId,
            journeyDate,
            from,
            to,
            classCode,
            selectedSeats,
            passengers,
        } = req.body;

        // Validate required fields
        if (
            !trainId ||
            !journeyDate ||
            !from ||
            !to ||
            !classCode ||
            !selectedSeats ||
            !passengers
        ) {
            return res.status(400).json({
                success: false,
                message: "All booking fields are required",
            });
        }

        // Validate arrays
        if (
            !Array.isArray(selectedSeats) ||
            !Array.isArray(passengers)
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Selected seats and passengers must be arrays",
            });
        }

        // At least one passenger
        if (passengers.length === 0) {
            return res.status(400).json({
                success: false,
                message:
                    "At least one passenger is required",
            });
        }

        // Maximum 6 passengers
        if (passengers.length > 6) {
            return res.status(400).json({
                success: false,
                message:
                    "Maximum 6 passengers allowed per booking",
            });
        }

        // Number of seats must match passengers
        if (
            selectedSeats.length !==
            passengers.length
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Number of selected seats must match number of passengers",
            });
        }

        // Prevent duplicate seats in request
        const uniqueSeats = new Set(selectedSeats);

        if (
            uniqueSeats.size !==
            selectedSeats.length
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Duplicate seats are not allowed",
            });
        }

        const normalizedClass =
            classCode.toUpperCase();

        let createdBooking;

        await session.withTransaction(async () => {
            // 1. Find train
            const train =
                await Train.findById(trainId).session(
                    session
                );

            if (!train) {
                throw new Error(
                    "Train not found"
                );
            }

            // 2. Find journey-specific inventory
            const inventory =
                await SeatInventory.findOne({
                    train: trainId,
                    journeyDate:
                        new Date(journeyDate),
                    classCode: normalizedClass,
                }).session(session);

            if (!inventory) {
                throw new Error(
                    "Seat inventory not initialized for this journey"
                );
            }

            // 3. Verify every selected seat exists
            const requestedSeats =
                selectedSeats.map((seat) =>
                    seat.toUpperCase()
                );

            const invalidSeats =
                requestedSeats.filter(
                    (seatNumber) =>
                        !inventory.seats.some(
                            (seat) =>
                                seat.seatNumber ===
                                seatNumber
                        )
                );

            if (invalidSeats.length > 0) {
                throw new Error(
                    `Invalid seat(s): ${invalidSeats.join(", ")}`
                );
            }

            // 4. Verify every selected seat is available
            const unavailableSeats =
                requestedSeats.filter(
                    (seatNumber) => {
                        const seat =
                            inventory.seats.find(
                                (seat) =>
                                    seat.seatNumber ===
                                    seatNumber
                            );

                        return (
                            seat.status !==
                            "AVAILABLE"
                        );
                    }
                );

            if (unavailableSeats.length > 0) {
                throw new Error(
                    `Seat(s) no longer available: ${unavailableSeats.join(", ")}`
                );
            }

            // 5. Mark EXACT selected seats as BOOKED
            for (const seat of inventory.seats) {
                if (
                    requestedSeats.includes(
                        seat.seatNumber
                    )
                ) {
                    seat.status = "BOOKED";
                }
            }

            await inventory.save({ session });

            // 6. Get class information
            const classInfo =
                train.classInventory.find(
                    (item) =>
                        item.classCode ===
                        normalizedClass
                );

            if (!classInfo) {
                throw new Error(
                    "Selected class is not available"
                );
            }

            // 7. Attach exact selected seats
            const bookingPassengers =
                passengers.map(
                    (passenger, index) => ({
                        name: passenger.name,
                        age: passenger.age,
                        gender: passenger.gender,
                        seatNumber:
                            requestedSeats[index],
                    })
                );

            // 8. Calculate fare
            const totalFare =
                classInfo.fare *
                passengers.length;

            // 9. Generate PNR
            const pnr = Math.floor(
                1000000000 +
                    Math.random() * 9000000000
            ).toString();

            // 10. Create booking
            const bookings =
                await Booking.create(
                    [
                        {
                            pnr,
                            user: req.user.userId,
                            train: trainId,
                            journeyDate,
                            from,
                            to,
                            classCode:
                                normalizedClass,
                            passengers:
                                bookingPassengers,
                            totalFare,
                            bookingStatus:
                                "PENDING",
                            paymentStatus:
                                "PENDING",
                        },
                    ],
                    { session }
                );

            createdBooking =
                bookings[0];
        });

        res.status(201).json({
            success: true,
            message:
                "Selected seats reserved and booking created successfully",
            booking: createdBooking,
        });
    } catch (error) {
        console.error(
            "Create booking error:",
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

const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user.userId,
        })
            .populate(
                "train",
                "trainNumber name departureTime arrivalTime duration"
            )
            .populate(
                "from",
                "name code city state"
            )
            .populate(
                "to",
                "name code city state"
            )
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: bookings.length,
            bookings,
        });
    } catch (error) {
        console.error(
            "Get my bookings error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const getBookingByPNR = async (req, res) => {
    try {
        const { pnr } = req.params;

        const booking = await Booking.findOne({
            pnr,
            user: req.user.userId,
        })
            .populate(
                "train",
                "trainNumber name departureTime arrivalTime duration"
            )
            .populate(
                "from",
                "name code city state"
            )
            .populate(
                "to",
                "name code city state"
            );

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: "Booking not found",
            });
        }

        res.status(200).json({
            success: true,
            booking,
        });
    } catch (error) {
        console.error(
            "Get booking error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

const cancelBooking = async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { pnr } = req.params;

        let cancelledBooking;

        await session.withTransaction(async () => {
            // 1. Find booking belonging to logged-in user
            const booking = await Booking.findOne({
                pnr,
                user: req.user.userId,
            }).session(session);

            if (!booking) {
                throw new Error("Booking not found");
            }

            // 2. Prevent double cancellation
            if (booking.bookingStatus === "CANCELLED") {
                throw new Error(
                    "Booking is already cancelled"
                );
            }

            // 3. Find the exact seat inventory
            const inventory = await SeatInventory.findOne({
                train: booking.train,
                journeyDate: booking.journeyDate,
                classCode: booking.classCode,
            }).session(session);

            if (!inventory) {
                throw new Error(
                    "Seat inventory not found"
                );
            }

            // 4. Get the seats assigned to this booking
            const bookedSeatNumbers =
                booking.passengers
                    .map(
                        (passenger) =>
                            passenger.seatNumber
                    )
                    .filter(Boolean);

            // 5. Release those exact seats
            for (const seat of inventory.seats) {
                if (
                    bookedSeatNumbers.includes(
                        seat.seatNumber
                    )
                ) {
                    seat.status = "AVAILABLE";
                }
            }

            await inventory.save({ session });

            // 6. Update booking status
            booking.bookingStatus = "CANCELLED";

            // 7. Refund only if payment was completed
            if (booking.paymentStatus === "PAID") {
                booking.paymentStatus = "REFUNDED";
            }

            await booking.save({ session });

            cancelledBooking = booking;
        });

        res.status(200).json({
            success: true,
            message:
                "Booking cancelled and seats released successfully",
            booking: cancelledBooking,
        });
    } catch (error) {
        console.error(
            "Cancel booking error:",
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
    createBooking,
    getMyBookings,
    getBookingByPNR,
    cancelBooking,
};