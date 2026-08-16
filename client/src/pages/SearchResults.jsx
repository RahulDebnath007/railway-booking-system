import { useEffect, useState } from "react";
import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import api from "../services/api";

function SearchResults() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const date = searchParams.get("date");
    const classCode = searchParams.get("class");

    useEffect(() => {
        const searchTrains = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(
                    "/trains/search",
                    {
                        params: {
                            from,
                            to,
                            date,
                            class: classCode,
                        },
                    }
                );

                setTrains(
                    response.data.trains
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to search trains"
                );
            } finally {
                setLoading(false);
            }
        };

        if (from && to && date) {
            searchTrains();
        }
    }, [from, to, date, classCode]);

    const handleSelectTrain = (train) => {
        if (!train.inventoryInitialized) {
            alert(
                "Seat inventory is not available for this journey."
            );
            return;
        }

        if (train.availableSeats === 0) {
            alert("No seats available.");
            return;
        }

        navigate(
            `/seats?trainId=${train.trainId}&date=${date}&class=${train.classCode}&from=${train.source._id}&to=${train.destination._id}&fromCode=${from}&toCode=${to}`
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="card">
                    <h2>
                        Searching trains...
                    </h2>

                    <p>
                        Finding available trains
                        for your journey.
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="page-container">
                <div className="card">
                    <h2>
                        Search Error
                    </h2>

                    <div className="error-message">
                        {error}
                    </div>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate("/")
                        }
                    >
                        Back to Search
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="navbar">
                <div className="navbar-brand">
                    RailBook
                </div>

                <div className="navbar-actions">
                    <button
                        onClick={() =>
                            navigate(
                                "/my-bookings"
                            )
                        }
                    >
                        My Bookings
                    </button>

                    <button
                        onClick={() => {
                            localStorage.removeItem(
                                "token"
                            );

                            localStorage.removeItem(
                                "user"
                            );

                            navigate("/login");
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="page-container">
                {/* Search summary */}
                <div className="hero">
                    <h1>
                        Available Trains
                    </h1>

                    <p>
                        {from} → {to}
                    </p>

                    <p>
                        Journey Date:{" "}
                        {date}
                    </p>

                    <p>
                        Class:{" "}
                        <strong>
                            {classCode}
                        </strong>
                    </p>
                </div>

                {/* No results */}
                {trains.length === 0 ? (
                    <div className="card">
                        <h2>
                            No trains found
                        </h2>

                        <p>
                            No trains are available
                            for this journey.
                        </p>

                        <button
                            className="primary-button"
                            onClick={() =>
                                navigate("/")
                            }
                        >
                            Search Again
                        </button>
                    </div>
                ) : (
                    /* Train results */
                    trains.map((train) => (
                        <div
                            className="card"
                            key={`${train.trainId}-${train.classCode}`}
                        >
                            <div className="booking-header">
                                <div>
                                    <h2>
                                        {
                                            train.name
                                        }
                                    </h2>

                                    <p>
                                        Train No.{" "}
                                        <strong>
                                            {
                                                train.trainNumber
                                            }
                                        </strong>
                                    </p>
                                </div>

                                <div>
                                    <span
                                        className={`status ${
                                            train.availableSeats >
                                            0
                                                ? "status-confirmed"
                                                : "status-cancelled"
                                        }`}
                                    >
                                        {train.availableSeats >
                                        0
                                            ? "AVAILABLE"
                                            : "SOLD OUT"}
                                    </span>
                                </div>
                            </div>

                            <hr />

                            {/* Route */}
                            <div
                                style={{
                                    display: "flex",
                                    justifyContent:
                                        "space-between",
                                    alignItems:
                                        "center",
                                    gap: "20px",
                                    margin: "25px 0",
                                }}
                            >
                                <div>
                                    <h2>
                                        {
                                            train.departureTime
                                        }
                                    </h2>

                                    <p>
                                        {
                                            train.source
                                                .code
                                        }
                                    </p>

                                    <small>
                                        {
                                            train.source
                                                .city
                                        }
                                    </small>
                                </div>

                                <div
                                    style={{
                                        flex: 1,
                                        textAlign:
                                            "center",
                                    }}
                                >
                                    <p>
                                        {
                                            train.duration
                                        }
                                    </p>

                                    <hr />

                                    <small>
                                        Journey
                                    </small>
                                </div>

                                <div
                                    style={{
                                        textAlign:
                                            "right",
                                    }}
                                >
                                    <h2>
                                        {
                                            train.arrivalTime
                                        }
                                    </h2>

                                    <p>
                                        {
                                            train.destination
                                                .code
                                        }
                                    </p>

                                    <small>
                                        {
                                            train.destination
                                                .city
                                        }
                                    </small>
                                </div>
                            </div>

                            {/* Train information */}
                            <div className="booking-meta">
                                <div className="booking-meta-item">
                                    <strong>
                                        Class
                                    </strong>

                                    <br />

                                    {train.classCode}
                                </div>

                                <div className="booking-meta-item">
                                    <strong>
                                        Fare
                                    </strong>

                                    <br />

                                    ₹
                                    {
                                        train.fare
                                    }
                                </div>

                                <div className="booking-meta-item">
                                    <strong>
                                        Available
                                    </strong>

                                    <br />

                                    {
                                        train.availableSeats
                                    }{" "}
                                    seats
                                </div>
                            </div>

                            {/* Inventory warning */}
                            {!train.inventoryInitialized && (
                                <div className="error-message">
                                    Seat inventory is
                                    not initialized
                                    for this journey.
                                </div>
                            )}

                            {/* Select button */}
                            <button
                                className="primary-button"
                                onClick={() =>
                                    handleSelectTrain(
                                        train
                                    )
                                }
                                disabled={
                                    !train.inventoryInitialized ||
                                    train.availableSeats ===
                                        0
                                }
                            >
                                {train.availableSeats ===
                                0
                                    ? "Sold Out"
                                    : "Select Train"}
                            </button>
                        </div>
                    ))
                )}
            </main>
        </div>
    );
}

export default SearchResults;