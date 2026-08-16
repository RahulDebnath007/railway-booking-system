const Train = require("../models/Train");
const SeatInventory = require("../models/SeatInventory");



const createTrain = async (req, res) => {
  try {
    const {
      trainNumber,
      name,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      runningDays,
      classInventory,
    } = req.body;

    if (
      !trainNumber ||
      !name ||
      !source ||
      !destination ||
      !departureTime ||
      !arrivalTime ||
      !duration ||
      !runningDays ||
      !classInventory
    ) {
      return res.status(400).json({
        success: false,
        message: "All required train fields must be provided",
      });
    }

    if (source === destination) {
      return res.status(400).json({
        success: false,
        message: "Source and destination cannot be the same",
      });
    }

    const existingTrain = await Train.findOne({ trainNumber });

    if (existingTrain) {
      return res.status(409).json({
        success: false,
        message: "Train already exists",
      });
    }

    const train = await Train.create({
      trainNumber,
      name,
      source,
      destination,
      departureTime,
      arrivalTime,
      duration,
      runningDays,
      classInventory,
      
    });

    const populatedTrain = await Train.findById(train._id)
      .populate("source", "name code city state")
      .populate("destination", "name code city state");

    res.status(201).json({
      success: true,
      message: "Train created successfully",
      train: populatedTrain,
    });
  } catch (error) {
    console.error("Create train error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getTrains = async (req, res) => {
  try {
    const trains = await Train.find()
      .populate("source", "name code city state")
      .populate("destination", "name code city state")
      .sort({ trainNumber: 1 });

    res.status(200).json({
      success: true,
      count: trains.length,
      trains,
    });
  } catch (error) {
    console.error("Get trains error:", error.message);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const searchTrains = async (req, res) => {
    try {
        const {
            from,
            to,
            date,
            class: classType,
        } = req.query;

        if (!from || !to || !date) {
            return res.status(400).json({
                success: false,
                message: "From, to and date are required",
            });
        }

        if (
            from.toUpperCase() ===
            to.toUpperCase()
        ) {
            return res.status(400).json({
                success: false,
                message:
                    "Source and destination cannot be the same",
            });
        }

        const Station = require("../models/Station");

        const sourceStation =
            await Station.findOne({
                code: from.toUpperCase(),
            });

        const destinationStation =
            await Station.findOne({
                code: to.toUpperCase(),
            });

        if (!sourceStation) {
            return res.status(404).json({
                success: false,
                message:
                    `Source station '${from}' not found`,
            });
        }

        if (!destinationStation) {
            return res.status(404).json({
                success: false,
                message:
                    `Destination station '${to}' not found`,
            });
        }

        const journeyDate = new Date(date);

        if (isNaN(journeyDate.getTime())) {
            return res.status(400).json({
                success: false,
                message: "Invalid journey date",
            });
        }

        const days = [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
        ];

        const journeyDay =
            days[journeyDate.getUTCDay()];

        /*
         * Find trains between the requested stations
         * that operate on the requested day.
         */
        const query = {
            source: sourceStation._id,
            destination: destinationStation._id,
            runningDays: journeyDay,
        };

        const trains = await Train.find(query)
            .populate(
                "source",
                "name code city state"
            )
            .populate(
                "destination",
                "name code city state"
            )
            .sort({
                departureTime: 1,
            });

        const results = [];

        for (const train of trains) {
            /*
             * If the user requested a specific class,
             * only return that class.
             */
            const classes = classType
                ? train.classInventory.filter(
                      (item) =>
                          item.classCode ===
                          classType.toUpperCase()
                  )
                : train.classInventory;

            for (const classInfo of classes) {
                /*
                 * Find inventory for this exact:
                 *
                 * train + journeyDate + class
                 */
                const inventory =
                    await SeatInventory.findOne({
                        train: train._id,
                        journeyDate:
                            journeyDate,
                        classCode:
                            classInfo.classCode,
                    });

                let totalSeats = classInfo.totalSeats;
                let availableSeats = 0;
                let bookedSeats = 0;

                if (inventory) {
                    availableSeats =
                        inventory.seats.filter(
                            (seat) =>
                                seat.status ===
                                "AVAILABLE"
                        ).length;

                    bookedSeats =
                        inventory.seats.filter(
                            (seat) =>
                                seat.status ===
                                "BOOKED"
                        ).length;

                    totalSeats =
                        inventory.seats.length;
                }

                results.push({
                    trainId: train._id,

                    trainNumber:
                        train.trainNumber,

                    name: train.name,

                    source: train.source,

                    destination:
                        train.destination,

                    departureTime:
                        train.departureTime,

                    arrivalTime:
                        train.arrivalTime,

                    duration:
                        train.duration,

                    journeyDate: date,

                    journeyDay,

                    classCode:
                        classInfo.classCode,

                    fare:
                        classInfo.fare,

                    totalSeats,

                    availableSeats,

                    bookedSeats,

                    inventoryInitialized:
                        !!inventory,
                });
            }
        }

        res.status(200).json({
            success: true,
            count: results.length,
            journeyDate: date,
            journeyDay,
            trains: results,
        });
    } catch (error) {
        console.error(
            "Search trains error:",
            error.message
        );

        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};

module.exports = {
  createTrain,
  getTrains,
  searchTrains,
};
