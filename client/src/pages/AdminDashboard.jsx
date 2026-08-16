import { useNavigate } from "react-router-dom";

function AdminDashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                backgroundColor: "#f4f7fb",
                color: "#1f2d43",
            }}
        >
            {/* ================= HEADER ================= */}
            <header
                style={{
                    backgroundColor: "#173f73",
                    color: "#ffffff",
                    padding: "20px 48px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.12)",
                }}
            >
                <div>
                    <h2
                        style={{
                            margin: 0,
                            fontSize: "28px",
                            fontWeight: "700",
                        }}
                    >
                        RailBook Admin
                    </h2>

                    <p
                        style={{
                            margin: "4px 0 0",
                            fontSize: "15px",
                            color: "#dbe7f5",
                        }}
                    >
                        Railway Booking Management System
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "18px",
                    }}
                >
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "500",
                        }}
                    >
                        Welcome, {user?.name || "Admin"}
                    </span>

                    <button
                        onClick={handleLogout}
                        style={{
                            padding: "11px 20px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#ffffff",
                            color: "#173f73",
                            fontSize: "15px",
                            fontWeight: "600",
                            cursor: "pointer",
                        }}
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* ================= MAIN ================= */}
            <main
                style={{
                    maxWidth: "1200px",
                    margin: "0 auto",
                    padding: "55px 30px",
                }}
            >
                {/* Page heading */}
                <div
                    style={{
                        marginBottom: "35px",
                    }}
                >
                    <h1
                        style={{
                            margin: 0,
                            fontSize: "42px",
                            fontWeight: "700",
                            color: "#1f2d43",
                        }}
                    >
                        Admin Dashboard
                    </h1>

                    <p
                        style={{
                            marginTop: "10px",
                            fontSize: "18px",
                            color: "#64748b",
                        }}
                    >
                        Manage your RailBook railway booking system.
                    </p>
                </div>

                {/* ================= MANAGEMENT CARDS ================= */}
                <section
                    style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: "25px",
                    }}
                >
                    {/* Stations */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "14px",
                            padding: "30px",
                            boxShadow:
                                "0 6px 20px rgba(31, 45, 67, 0.08)",
                            border: "1px solid #e3eaf2",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "12px",
                                backgroundColor: "#e8f0ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "25px",
                                marginBottom: "20px",
                            }}
                        >
                            🚉
                        </div>

                        <h2
                            style={{
                                margin: "0 0 10px",
                                fontSize: "24px",
                            }}
                        >
                            Stations
                        </h2>

                        <p
                            style={{
                                color: "#64748b",
                                lineHeight: "1.6",
                                minHeight: "50px",
                            }}
                        >
                            Add and manage railway stations used by
                            RailBook.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/stations")
                            }
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: "#2864e8",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Stations
                        </button>
                    </div>

                    {/* Trains */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "14px",
                            padding: "30px",
                            boxShadow:
                                "0 6px 20px rgba(31, 45, 67, 0.08)",
                            border: "1px solid #e3eaf2",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "12px",
                                backgroundColor: "#e8f0ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "25px",
                                marginBottom: "20px",
                            }}
                        >
                            🚆
                        </div>

                        <h2
                            style={{
                                margin: "0 0 10px",
                                fontSize: "24px",
                            }}
                        >
                            Trains
                        </h2>

                        <p
                            style={{
                                color: "#64748b",
                                lineHeight: "1.6",
                                minHeight: "50px",
                            }}
                        >
                            Add and manage trains, routes, schedules
                            and classes.
                        </p>

                        <button
                            onClick={() =>
                                navigate("/admin/trains")
                            }
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: "#2864e8",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Trains
                        </button>
                    </div>

                    {/* Seat Inventory */}
                    <div
                        style={{
                            backgroundColor: "#ffffff",
                            borderRadius: "14px",
                            padding: "30px",
                            boxShadow:
                                "0 6px 20px rgba(31, 45, 67, 0.08)",
                            border: "1px solid #e3eaf2",
                        }}
                    >
                        <div
                            style={{
                                width: "52px",
                                height: "52px",
                                borderRadius: "12px",
                                backgroundColor: "#e8f0ff",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "25px",
                                marginBottom: "20px",
                            }}
                        >
                            💺
                        </div>

                        <h2
                            style={{
                                margin: "0 0 10px",
                                fontSize: "24px",
                            }}
                        >
                            Seat Inventory
                        </h2>

                        <p
                            style={{
                                color: "#64748b",
                                lineHeight: "1.6",
                                minHeight: "50px",
                            }}
                        >
                            Initialize and manage seats for specific
                            train journeys.
                        </p>

                        <button
                            onClick={() =>
                                navigate(
                                    "/admin/seat-inventory"
                                )
                            }
                            style={{
                                width: "100%",
                                marginTop: "20px",
                                padding: "13px",
                                border: "none",
                                borderRadius: "8px",
                                backgroundColor: "#2864e8",
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: "600",
                                cursor: "pointer",
                            }}
                        >
                            Manage Seats
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default AdminDashboard;