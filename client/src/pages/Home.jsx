import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../context/ThemeContext";

function Home() {
    const navigate = useNavigate();

    const { darkMode, toggleDarkMode } = useTheme();

    const [stations, setStations] = useState([]);
    const [loadingStations, setLoadingStations] = useState(true);

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [date, setDate] = useState("");
    const [classCode, setClassCode] = useState("3A");

    const [error, setError] = useState("");

    // Get logged-in user
    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    /*
     * =====================================
     * LOAD STATIONS
     * =====================================
     */
    useEffect(() => {
        const fetchStations = async () => {
            try {
                setLoadingStations(true);
                setError("");

                const response = await api.get(
                    "/stations"
                );

                setStations(
                    response.data.stations || []
                );
            } catch (error) {
                console.error(
                    "Failed to load stations:",
                    error
                );

                setError(
                    "Unable to load railway stations."
                );
            } finally {
                setLoadingStations(false);
            }
        };

        fetchStations();
    }, []);

    /*
     * =====================================
     * SEARCH TRAINS
     * =====================================
     */
    const handleSearch = (e) => {
        e.preventDefault();

        if (!from || !to || !date) {
            alert(
                "Please select your departure station, destination station and journey date."
            );
            return;
        }

        if (from === to) {
            alert(
                "Departure and destination stations cannot be the same."
            );
            return;
        }

        navigate(
            `/search?from=${from}&to=${to}&date=${date}&class=${classCode}`
        );
    };

    /*
     * =====================================
     * LOGOUT
     * =====================================
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <div>
            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <div className="navbar-brand">
                    RailBook
                </div>

                <div className="navbar-actions">

                    {/* Dark Mode */}

                    <button
                        className="theme-toggle"
                        onClick={toggleDarkMode}
                        title={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        {darkMode
                            ? "☀️ Light"
                            : "🌙 Dark"}
                    </button>

                    {/* Admin */}

                    {user?.role === "admin" && (
                        <button
                            onClick={() =>
                                navigate("/admin")
                            }
                        >
                            Admin
                        </button>
                    )}

                    {/* My Bookings */}

                    <button
                        onClick={() =>
                            navigate("/my-bookings")
                        }
                    >
                        My Bookings
                    </button>

                    {/* Logout */}

                    <button
                        onClick={handleLogout}
                    >
                        Logout
                    </button>

                </div>

            </nav>

            {/* ================= MAIN ================= */}

            <main className="page-container">

                {/* Hero */}

                <div className="hero">

                    <h1>
                        Book Your Train Journey
                    </h1>

                    <p>
                        Search trains, select your
                        seat and book your journey.
                    </p>

                </div>

                {/* Search Card */}

                <div className="card search-card">

                    <h2>
                        Search Trains
                    </h2>

                    <form
                        onSubmit={handleSearch}
                    >

                        <div className="form-grid">

                            {/* ================= FROM ================= */}

                            <div className="form-group">

                                <label>
                                    From
                                </label>

                                <select
                                    value={from}
                                    onChange={(e) =>
                                        setFrom(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        loadingStations
                                    }
                                >

                                    <option value="">
                                        {loadingStations
                                            ? "Loading stations..."
                                            : "Select departure station"}
                                    </option>

                                    {stations.map(
                                        (station) => (
                                            <option
                                                key={
                                                    station._id ||
                                                    station.code
                                                }
                                                value={
                                                    station.code
                                                }
                                            >
                                                {station.name} (
                                                {station.code}) -{" "}
                                                {station.city}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* ================= TO ================= */}

                            <div className="form-group">

                                <label>
                                    To
                                </label>

                                <select
                                    value={to}
                                    onChange={(e) =>
                                        setTo(
                                            e.target.value
                                        )
                                    }
                                    disabled={
                                        loadingStations
                                    }
                                >

                                    <option value="">
                                        {loadingStations
                                            ? "Loading stations..."
                                            : "Select destination station"}
                                    </option>

                                    {stations.map(
                                        (station) => (
                                            <option
                                                key={
                                                    station._id ||
                                                    station.code
                                                }
                                                value={
                                                    station.code
                                                }
                                            >
                                                {station.name} (
                                                {station.code}) -{" "}
                                                {station.city}
                                            </option>
                                        )
                                    )}

                                </select>

                            </div>

                            {/* ================= DATE ================= */}

                            <div className="form-group">

                                <label>
                                    Journey Date
                                </label>

                                <input
                                    type="date"
                                    value={date}
                                    onChange={(e) =>
                                        setDate(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                            {/* ================= CLASS ================= */}

                            <div className="form-group">

                                <label>
                                    Class
                                </label>

                                <select
                                    value={classCode}
                                    onChange={(e) =>
                                        setClassCode(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="1A">
                                        First AC (1A)
                                    </option>

                                    <option value="2A">
                                        Second AC (2A)
                                    </option>

                                    <option value="3A">
                                        Third AC (3A)
                                    </option>

                                    <option value="SL">
                                        Sleeper (SL)
                                    </option>

                                    <option value="CC">
                                        Chair Car (CC)
                                    </option>

                                    <option value="2S">
                                        Second Sitting (2S)
                                    </option>

                                </select>

                            </div>

                        </div>

                        {/* API Error */}

                        {error && (
                            <p
                                style={{
                                    color: "#c62828",
                                    marginTop: "15px",
                                }}
                            >
                                {error}
                            </p>
                        )}

                        <br />

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={
                                loadingStations
                            }
                        >
                            {loadingStations
                                ? "Loading Stations..."
                                : "Search Trains"}
                        </button>

                    </form>

                </div>

            </main>

        </div>
    );
}

export default Home;