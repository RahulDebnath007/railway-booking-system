import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function ManageTrains() {
    const navigate = useNavigate();

    const [stations, setStations] = useState([]);
    const [trains, setTrains] = useState([]);

    const [formData, setFormData] = useState({
        trainNumber: "",
        name: "",
        source: "",
        destination: "",
        departureTime: "",
        arrivalTime: "",
        duration: "",
        runningDays: [],
    });

    const [classInventory, setClassInventory] = useState([
        {
            classCode: "1A",
            totalSeats: "",
            fare: "",
        },
    ]);

    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const runningDayOptions = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const classOptions = [
        "1A",
        "2A",
        "3A",
        "SL",
        "CC",
        "2S",
    ];

    // Fetch stations and trains
    const fetchData = async () => {
        try {
            setLoading(true);
            setError("");

            const [stationResponse, trainResponse] =
                await Promise.all([
                    api.get("/stations"),
                    api.get("/trains"),
                ]);

            setStations(
                stationResponse.data.stations || []
            );

            setTrains(
                trainResponse.data.trains || []
            );
        } catch (error) {
            console.error(
                "Fetch train management data error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to load train data."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle normal inputs
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    // Running days
    const handleDayChange = (day) => {
        setFormData((current) => {
            const alreadySelected =
                current.runningDays.includes(day);

            return {
                ...current,
                runningDays: alreadySelected
                    ? current.runningDays.filter(
                          (item) => item !== day
                      )
                    : [
                          ...current.runningDays,
                          day,
                      ],
            };
        });
    };

    // Class inventory
    const handleClassChange = (
        index,
        field,
        value
    ) => {
        setClassInventory((current) =>
            current.map((item, itemIndex) =>
                itemIndex === index
                    ? {
                          ...item,
                          [field]: value,
                      }
                    : item
            )
        );
    };

    const addClass = () => {
        setClassInventory((current) => [
            ...current,
            {
                classCode: "",
                totalSeats: "",
                fare: "",
            },
        ]);
    };

    const removeClass = (index) => {
        setClassInventory((current) =>
            current.filter(
                (_, itemIndex) =>
                    itemIndex !== index
            )
        );
    };

    // Create train
    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        const {
            trainNumber,
            name,
            source,
            destination,
            departureTime,
            arrivalTime,
            duration,
            runningDays,
        } = formData;

        if (
            !trainNumber.trim() ||
            !name.trim() ||
            !source ||
            !destination ||
            !departureTime ||
            !arrivalTime ||
            !duration.trim()
        ) {
            setError(
                "All train fields are required."
            );
            return;
        }

        if (source === destination) {
            setError(
                "Source and destination cannot be the same."
            );
            return;
        }

        if (runningDays.length === 0) {
            setError(
                "Select at least one running day."
            );
            return;
        }

        if (classInventory.length === 0) {
            setError(
                "Add at least one class."
            );
            return;
        }

        const formattedInventory =
            classInventory.map((item) => ({
                classCode:
                    item.classCode.toUpperCase(),
                totalSeats: Number(
                    item.totalSeats
                ),
                fare: Number(item.fare),
            }));

        const invalidClass =
            formattedInventory.some(
                (item) =>
                    !classOptions.includes(
                        item.classCode
                    ) ||
                    !item.totalSeats ||
                    item.totalSeats < 1 ||
                    item.fare < 0
            );

        if (invalidClass) {
            setError(
                "Please provide valid class, seat and fare information."
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await api.post(
                "/admin/trains",
                {
                    trainNumber:
                        trainNumber.trim(),
                    name: name.trim(),
                    source,
                    destination,
                    departureTime,
                    arrivalTime,
                    duration: duration.trim(),
                    runningDays,
                    classInventory:
                        formattedInventory,
                }
            );

            setSuccess(
                response.data.message ||
                    "Train created successfully."
            );

            setFormData({
                trainNumber: "",
                name: "",
                source: "",
                destination: "",
                departureTime: "",
                arrivalTime: "",
                duration: "",
                runningDays: [],
            });

            setClassInventory([
                {
                    classCode: "1A",
                    totalSeats: "",
                    fare: "",
                },
            ]);

            await fetchData();
        } catch (error) {
            console.error(
                "Create train error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to create train."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="admin-page">

            <header className="admin-header">
                <div>
                    <h2>RailBook Admin</h2>
                    <p>Train Management</p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/admin")
                    }
                    className="admin-back-button"
                >
                    ← Dashboard
                </button>
            </header>

            <main className="admin-container">

                <div className="admin-page-heading">
                    <h1>Manage Trains</h1>

                    <p>
                        Add and manage trains used by
                        RailBook.
                    </p>
                </div>

                {/* Add Train */}
                <section className="admin-card">

                    <h2>Add New Train</h2>

                    <p className="admin-card-description">
                        Enter the train information below.
                    </p>

                    {error && (
                        <div className="admin-error">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="admin-success">
                            {success}
                        </div>
                    )}

                    <form
                        onSubmit={handleSubmit}
                        className="train-form"
                    >

                        {/* Train Number */}
                        <div className="form-group">
                            <label>
                                Train Number
                            </label>

                            <input
                                type="text"
                                name="trainNumber"
                                value={
                                    formData.trainNumber
                                }
                                onChange={handleChange}
                                placeholder="12301"
                            />
                        </div>

                        {/* Train Name */}
                        <div className="form-group">
                            <label>
                                Train Name
                            </label>

                            <input
                                type="text"
                                name="name"
                                value={
                                    formData.name
                                }
                                onChange={handleChange}
                                placeholder="Howrah Rajdhani Express"
                            />
                        </div>

                        {/* Source */}
                        <div className="form-group">
                            <label>
                                Source Station
                            </label>

                            <select
                                name="source"
                                value={
                                    formData.source
                                }
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select source
                                </option>

                                {stations.map(
                                    (station) => (
                                        <option
                                            key={
                                                station._id
                                            }
                                            value={
                                                station._id
                                            }
                                        >
                                            {
                                                station.name
                                            }{" "}
                                            (
                                            {
                                                station.code
                                            }
                                            )
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Destination */}
                        <div className="form-group">
                            <label>
                                Destination Station
                            </label>

                            <select
                                name="destination"
                                value={
                                    formData.destination
                                }
                                onChange={handleChange}
                            >
                                <option value="">
                                    Select destination
                                </option>

                                {stations.map(
                                    (station) => (
                                        <option
                                            key={
                                                station._id
                                            }
                                            value={
                                                station._id
                                            }
                                        >
                                            {
                                                station.name
                                            }{" "}
                                            (
                                            {
                                                station.code
                                            }
                                            )
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        {/* Departure */}
                        <div className="form-group">
                            <label>
                                Departure Time
                            </label>

                            <input
                                type="time"
                                name="departureTime"
                                value={
                                    formData.departureTime
                                }
                                onChange={handleChange}
                            />
                        </div>

                        {/* Arrival */}
                        <div className="form-group">
                            <label>
                                Arrival Time
                            </label>

                            <input
                                type="time"
                                name="arrivalTime"
                                value={
                                    formData.arrivalTime
                                }
                                onChange={handleChange}
                            />
                        </div>

                        {/* Duration */}
                        <div className="form-group">
                            <label>
                                Duration
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={
                                    formData.duration
                                }
                                onChange={handleChange}
                                placeholder="17h 00m"
                            />
                        </div>

                        {/* Running Days */}
                        <div className="form-group full-width">
                            <label>
                                Running Days
                            </label>

                            <div className="days-grid">
                                {runningDayOptions.map(
                                    (day) => (
                                        <label
                                            key={day}
                                            className="day-checkbox"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.runningDays.includes(
                                                    day
                                                )}
                                                onChange={() =>
                                                    handleDayChange(
                                                        day
                                                    )
                                                }
                                            />

                                            {day}
                                        </label>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Class Inventory */}
                        <div className="form-group full-width">

                            <div className="inventory-header">
                                <div>
                                    <label>
                                        Class Inventory
                                    </label>

                                    <p className="admin-card-description">
                                        Configure seats
                                        and fare for
                                        each class.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={addClass}
                                    className="admin-secondary-button"
                                >
                                    + Add Class
                                </button>
                            </div>

                            <div className="inventory-list">

                                {classInventory.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            className="inventory-row"
                                            key={index}
                                        >

                                            <select
                                                value={
                                                    item.classCode
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleClassChange(
                                                        index,
                                                        "classCode",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                            >
                                                <option value="">
                                                    Select
                                                    class
                                                </option>

                                                {classOptions.map(
                                                    (
                                                        classCode
                                                    ) => (
                                                        <option
                                                            key={
                                                                classCode
                                                            }
                                                            value={
                                                                classCode
                                                            }
                                                        >
                                                            {
                                                                classCode
                                                            }
                                                        </option>
                                                    )
                                                )}
                                            </select>

                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Total seats"
                                                value={
                                                    item.totalSeats
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleClassChange(
                                                        index,
                                                        "totalSeats",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            <input
                                                type="number"
                                                min="0"
                                                placeholder="Fare"
                                                value={
                                                    item.fare
                                                }
                                                onChange={(
                                                    e
                                                ) =>
                                                    handleClassChange(
                                                        index,
                                                        "fare",
                                                        e
                                                            .target
                                                            .value
                                                    )
                                                }
                                            />

                                            {classInventory.length >
                                                1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeClass(
                                                            index
                                                        )
                                                    }
                                                    className="admin-danger-button"
                                                >
                                                    Remove
                                                </button>
                                            )}
                                        </div>
                                    )
                                )}

                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={submitting}
                            className="admin-primary-button"
                        >
                            {submitting
                                ? "Adding Train..."
                                : "Add Train"}
                        </button>

                    </form>
                </section>

                {/* Existing Trains */}
                <section className="admin-card">

                    <div className="station-list-header">

                        <div>
                            <h2>Existing Trains</h2>

                            <p className="admin-card-description">
                                {trains.length} train
                                {trains.length !== 1
                                    ? "s"
                                    : ""}{" "}
                                registered.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={fetchData}
                            className="admin-secondary-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Refreshing..."
                                : "Refresh"}
                        </button>

                    </div>

                    {loading ? (
                        <div className="admin-empty">
                            Loading trains...
                        </div>
                    ) : trains.length === 0 ? (
                        <div className="admin-empty">
                            No trains found.
                        </div>
                    ) : (
                        <div className="station-table-wrapper">

                            <table className="station-table">

                                <thead>
                                    <tr>
                                        <th>
                                            Train
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            From
                                        </th>

                                        <th>
                                            To
                                        </th>

                                        <th>
                                            Departure
                                        </th>

                                        <th>
                                            Arrival
                                        </th>

                                        <th>
                                            Duration
                                        </th>

                                        <th>
                                            Classes
                                        </th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {trains.map(
                                        (train) => (
                                            <tr
                                                key={
                                                    train._id
                                                }
                                            >
                                                <td>
                                                    <strong>
                                                        {
                                                            train.trainNumber
                                                        }
                                                    </strong>
                                                </td>

                                                <td>
                                                    {
                                                        train.name
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train
                                                            .source
                                                            ?.code
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train
                                                            .destination
                                                            ?.code
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train.departureTime
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train.arrivalTime
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train.duration
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        train
                                                            .classInventory
                                                            ?.length ||
                                                        0
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}

                </section>

            </main>
        </div>
    );
}

export default ManageTrains;