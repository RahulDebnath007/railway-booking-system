import { useEffect, useState } from "react";
import {
    useSearchParams,
    useNavigate,
} from "react-router-dom";
import api from "../services/api";

function SeatSelection() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const trainId =
        searchParams.get("trainId");

    const journeyDate =
        searchParams.get("date");

    const classCode =
        searchParams.get("class");

    const from =
        searchParams.get("from");

    const to =
        searchParams.get("to");

    const fromCode =
        searchParams.get("fromCode");

    const toCode =
        searchParams.get("toCode");

    const [inventory, setInventory] =
        useState(null);

    const [selectedSeats, setSelectedSeats] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const fetchSeats = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await api.get(
                        "/seat-inventory",
                        {
                            params: {
                                trainId,
                                journeyDate,
                                classCode,
                            },
                        }
                    );

                setInventory(
                    response.data
                );
            } catch (error) {
                console.error(error);

                setError(
                    error.response?.data
                        ?.message ||
                        "Unable to load seats"
                );
            } finally {
                setLoading(false);
            }
        };

        if (
            trainId &&
            journeyDate &&
            classCode
        ) {
            fetchSeats();
        }
    }, [
        trainId,
        journeyDate,
        classCode,
    ]);

    const toggleSeat = (seat) => {
        if (
            seat.status ===
            "BOOKED"
        ) {
            return;
        }

        setSelectedSeats(
            (current) => {
                const alreadySelected =
                    current.includes(
                        seat.seatNumber
                    );

                if (
                    alreadySelected
                ) {
                    return current.filter(
                        (seatNumber) =>
                            seatNumber !==
                            seat.seatNumber
                    );
                }

                return [
                    ...current,
                    seat.seatNumber,
                ];
            }
        );
    };

    const handleContinue = () => {
        if (
            selectedSeats.length ===
            0
        ) {
            alert(
                "Please select at least one seat."
            );

            return;
        }

        navigate(
            `/passengers?trainId=${trainId}&date=${journeyDate}&class=${classCode}&from=${from}&to=${to}&fromCode=${fromCode}&toCode=${toCode}&seats=${selectedSeats.join(",")}`
        );
    };

    if (loading) {
        return (
            <div className="page-container">
                <div className="card">
                    <h2>
                        Loading seats...
                    </h2>

                    <p>
                        Please wait while we
                        load the seat
                        availability.
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
                        Seat Selection Error
                    </h2>

                    <div className="error-message">
                        {error}
                    </div>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    if (!inventory) {
        return (
            <div className="page-container">
                <div className="card">
                    <h2>
                        Seat inventory not
                        found.
                    </h2>

                    <button
                        className="secondary-button"
                        onClick={() =>
                            navigate(-1)
                        }
                    >
                        Go Back
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

                            navigate(
                                "/login"
                            );
                        }}
                    >
                        Logout
                    </button>
                </div>
            </nav>

            <main className="page-container">
                {/* Header */}
                <div className="hero">
                    <h1>
                        Select Your Seats
                    </h1>

                    <p>
                        {fromCode} →{" "}
                        {toCode}
                    </p>

                    <p>
                        Journey Date:{" "}
                        {journeyDate}
                    </p>

                    <p>
                        <strong>
                            {classCode} Coach
                        </strong>
                    </p>
                </div>

                {/* Seat selection card */}
                <div className="card">
                    <h2>
                        Choose Your Seats
                    </h2>

                    {/* Legend */}
                    <div
                        style={{
                            display: "flex",
                            gap: "20px",
                            flexWrap:
                                "wrap",
                            marginBottom:
                                "20px",
                        }}
                    >
                        <span>
                            🟢 Available
                        </span>

                        <span>
                            🔴 Booked
                        </span>

                        <span>
                            🔵 Selected
                        </span>
                    </div>

                    <hr />

                    {/* Seats */}
                    <div className="seat-grid">
                        {inventory.seats.map(
                            (seat) => {
                                const isSelected =
                                    selectedSeats.includes(
                                        seat.seatNumber
                                    );

                                let seatClass =
                                    "seat seat-available";

                                if (
                                    seat.status ===
                                    "BOOKED"
                                ) {
                                    seatClass =
                                        "seat seat-booked";
                                } else if (
                                    isSelected
                                ) {
                                    seatClass =
                                        "seat seat-selected";
                                }

                                return (
                                    <button
                                        key={
                                            seat.seatNumber
                                        }
                                        className={
                                            seatClass
                                        }
                                        disabled={
                                            seat.status ===
                                            "BOOKED"
                                        }
                                        onClick={() =>
                                            toggleSeat(
                                                seat
                                            )
                                        }
                                    >
                                        {
                                            seat.seatNumber
                                        }
                                    </button>
                                );
                            }
                        )}
                    </div>
                </div>

                {/* Selected seats */}
                <div className="card">
                    <h2>
                        Selected Seats
                    </h2>

                    <p>
                        <strong>
                            Seats Selected:
                        </strong>{" "}
                        {
                            selectedSeats.length
                        }
                    </p>

                    {selectedSeats.length >
                    0 ? (
                        <div>
                            <p>
                                <strong>
                                    Your Seats:
                                </strong>
                            </p>

                            <p>
                                {selectedSeats.join(
                                    ", "
                                )}
                            </p>

                            <button
                                className="primary-button"
                                onClick={
                                    handleContinue
                                }
                            >
                                Continue to
                                Passenger Details
                            </button>
                        </div>
                    ) : (
                        <div>
                            <p>
                                No seats
                                selected.
                            </p>

                            <button
                                className="secondary-button"
                                disabled
                            >
                                Continue
                            </button>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

export default SeatSelection;