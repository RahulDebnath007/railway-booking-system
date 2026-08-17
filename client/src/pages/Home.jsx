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

                const response = await api.get("/stations");

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
        <div className="railbook-home">

            {/* =========================================
                NAVBAR
            ========================================= */}

            <nav className="navbar railbook-navbar">

                {/* Brand */}
                <div
                    className="navbar-brand railbook-brand"
                    onClick={() => navigate("/")}
                >
                    <span className="railbook-logo">
                        🚆
                    </span>

                    <span>RailBook</span>
                </div>

                {/* Navbar Actions */}
                <div className="navbar-actions railbook-navbar-actions">

                    {/* Theme Toggle */}
                    <button
                        type="button"
                        className="theme-toggle railbook-nav-button"
                        onClick={toggleDarkMode}
                        title={
                            darkMode
                                ? "Switch to light mode"
                                : "Switch to dark mode"
                        }
                    >
                        <span className="nav-button-icon">
                            {darkMode ? "☀️" : "🌙"}
                        </span>

                        <span>
                            {darkMode ? "Light" : "Dark"}
                        </span>
                    </button>

                    {/* Admin */}
                    {user?.role === "admin" && (
                        <button
                            type="button"
                            className="railbook-nav-button"
                            onClick={() =>
                                navigate("/admin")
                            }
                        >
                            <span className="nav-button-icon">
                                ⚙️
                            </span>

                            <span>Admin</span>
                        </button>
                    )}

                    {/* My Bookings */}
                    <button
                        type="button"
                        className="railbook-nav-button"
                        onClick={() =>
                            navigate("/my-bookings")
                        }
                    >
                        <span className="nav-button-icon">
                            🎟️
                        </span>

                        <span>My Bookings</span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        className="railbook-nav-button"
                        onClick={handleLogout}
                    >
                        <span className="nav-button-icon">
                            ↪
                        </span>

                        <span>Logout</span>
                    </button>

                </div>
            </nav>


            {/* =========================================
                HERO SECTION
            ========================================= */}

            <main className="railbook-main">

                <section className="railbook-hero">

                    <div className="railway-background railway-background-left">
                        🚆
                    </div>

                    <div className="railway-background railway-background-right">
                        🌉
                    </div>

                    <div className="railbook-hero-content">

                        <h1>
                            Book Your{" "}
                            <span>Train Journey</span>
                        </h1>

                        <div className="hero-line"></div>

                        <p>
                            Search trains, select your seat
                            and book your journey.
                        </p>

                    </div>

                </section>


                {/* =========================================
                    SEARCH SECTION
                ========================================= */}

                <section className="railbook-search-section">

                    <div className="railbook-search-card">

                        {/* Search Header */}

                        <div className="search-card-heading">

                            <div className="search-heading-icon">
                                🔎
                            </div>

                            <h2>
                                Search Trains
                            </h2>

                        </div>


                        {/* Search Form */}

                        <form
                            onSubmit={handleSearch}
                            className="railbook-search-form"
                        >

                            <div className="railbook-form-grid">

                                {/* =================================
                                    FROM
                                ================================= */}

                                <div className="railbook-form-group">

                                    <label htmlFor="from">
                                        From
                                    </label>

                                    <div className="railbook-input-wrapper">

                                        <span className="railbook-input-icon">
                                            📍
                                        </span>

                                        <select
                                            id="from"
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
                                                        {
                                                            station.code
                                                        }) -{" "}
                                                        {
                                                            station.city
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                {/* =================================
                                    TO
                                ================================= */}

                                <div className="railbook-form-group">

                                    <label htmlFor="to">
                                        To
                                    </label>

                                    <div className="railbook-input-wrapper">

                                        <span className="railbook-input-icon">
                                            📍
                                        </span>

                                        <select
                                            id="to"
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
                                                        {
                                                            station.code
                                                        }) -{" "}
                                                        {
                                                            station.city
                                                        }
                                                    </option>
                                                )
                                            )}

                                        </select>

                                    </div>

                                </div>


                                {/* =================================
                                    JOURNEY DATE
                                ================================= */}

                                <div className="railbook-form-group">

                                    <label htmlFor="journey-date">
                                        Journey Date
                                    </label>

                                    <div className="railbook-input-wrapper">

                                        <span className="railbook-input-icon">
                                            📅
                                        </span>

                                        <input
                                            id="journey-date"
                                            type="date"
                                            value={date}
                                            onChange={(e) =>
                                                setDate(
                                                    e.target.value
                                                )
                                            }
                                        />

                                    </div>

                                </div>


                                {/* =================================
                                    CLASS
                                ================================= */}

                                <div className="railbook-form-group">

                                    <label htmlFor="class">
                                        Class
                                    </label>

                                    <div className="railbook-input-wrapper">

                                        <span className="railbook-input-icon">
                                            💺
                                        </span>

                                        <select
                                            id="class"
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

                            </div>


                            {/* API Error */}

                            {error && (
                                <p className="railbook-search-error">
                                    {error}
                                </p>
                            )}


                            {/* Search Button */}

                            <button
                                type="submit"
                                className="railbook-search-button"
                                disabled={loadingStations}
                            >

                                <span className="search-button-icon">
                                    🚆
                                </span>

                                <span>
                                    {loadingStations
                                        ? "Loading Stations..."
                                        : "Search Trains"}
                                </span>

                                {!loadingStations && (
                                    <span className="search-button-arrow">
                                        →
                                    </span>
                                )}

                            </button>

                        </form>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Home;