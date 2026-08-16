import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (
            !formData.name.trim() ||
            !formData.email.trim() ||
            !formData.password.trim()
        ) {
            setError(
                "Name, email and password are required."
            );
            return;
        }

        if (formData.password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        try {
            setLoading(true);

            await api.post(
                "/auth/register",
                formData
            );

            setSuccess(
                "Account created successfully. Redirecting to login..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            console.error(
                "Signup error:",
                error
            );

            setError(
                error.response?.data?.message ||
                    "Unable to create account."
            );
        } finally {
            setLoading(false);
        }
    };

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
                            navigate("/login")
                        }
                    >
                        Login
                    </button>
                </div>
            </nav>

            {/* Signup Page */}
            <main className="page-container">
                <div
                    style={{
                        maxWidth: "520px",
                        margin: "60px auto",
                    }}
                >
                    {/* Header */}
                    <div
                        className="hero"
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <h1>
                            Create Your Account
                        </h1>

                        <p>
                            Join RailBook and book
                            your train journeys
                            easily.
                        </p>
                    </div>

                    {/* Signup Card */}
                    <div className="card">
                        <form
                            onSubmit={handleSubmit}
                        >
                            {/* Name */}
                            <div className="form-group">
                                <label>
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your full name"
                                    autoComplete="name"
                                />
                            </div>

                            {/* Email */}
                            <div
                                className="form-group"
                                style={{
                                    marginTop: "20px",
                                }}
                            >
                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                />
                            </div>

                            {/* Password */}
                            <div
                                className="form-group"
                                style={{
                                    marginTop: "20px",
                                }}
                            >
                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Create a password"
                                    autoComplete="new-password"
                                />

                                <small
                                    style={{
                                        display:
                                            "block",
                                        marginTop:
                                            "7px",
                                        color:
                                            "#64748b",
                                    }}
                                >
                                    Password must
                                    contain at least
                                    6 characters.
                                </small>
                            </div>

                            {/* Phone */}
                            <div
                                className="form-group"
                                style={{
                                    marginTop: "20px",
                                }}
                            >
                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Enter your phone number"
                                    autoComplete="tel"
                                />
                            </div>

                            {/* Error */}
                            {error && (
                                <div
                                    className="error-message"
                                    style={{
                                        marginTop:
                                            "20px",
                                    }}
                                >
                                    {error}
                                </div>
                            )}

                            {/* Success */}
                            {success && (
                                <div
                                    style={{
                                        marginTop:
                                            "20px",
                                        padding:
                                            "12px 16px",
                                        borderRadius:
                                            "8px",
                                        background:
                                            "#dcfce7",
                                        color:
                                            "#166534",
                                        fontWeight:
                                            "600",
                                    }}
                                >
                                    {success}
                                </div>
                            )}

                            {/* Signup Button */}
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={loading}
                                style={{
                                    width: "100%",
                                    marginTop:
                                        "24px",
                                }}
                            >
                                {loading
                                    ? "Creating Account..."
                                    : "Create Account"}
                            </button>
                        </form>

                        {/* Login */}
                        <div
                            style={{
                                textAlign: "center",
                                marginTop: "24px",
                            }}
                        >
                            <p>
                                Already have an
                                account?
                            </p>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(
                                        "/login"
                                    )
                                }
                                style={{
                                    background:
                                        "none",
                                    border: "none",
                                    padding: 0,
                                    color:
                                        "#2563eb",
                                    cursor:
                                        "pointer",
                                    fontWeight:
                                        "600",
                                }}
                            >
                                Login to RailBook
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default Signup;