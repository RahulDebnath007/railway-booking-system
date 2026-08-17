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

      await api.post("/auth/register", formData);

      setSuccess(
        "Account created successfully. Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      console.error("Signup error:", error);

      setError(
        error.response?.data?.message ||
          "Unable to create account."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container auth-signup-container">

        {/* LEFT PANEL */}
        <div className="auth-welcome-panel">
          <div className="auth-welcome-content">
            <div className="auth-logo">🚆</div>

            <h1>Welcome!</h1>

            <p>Already have an account?</p>

            <button
              type="button"
              className="auth-outline-button"
              onClick={() => navigate("/login")}
            >
              Login
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <h2>Register</h2>

            <p className="auth-form-subtitle">
              Create your RailBook account
            </p>

            <form onSubmit={handleSubmit}>

              {/* NAME */}
              <div className="auth-input-box">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Full Name"
                  autoComplete="name"
                />

                <span className="auth-input-icon">
                  👤
                </span>
              </div>

              {/* EMAIL */}
              <div className="auth-input-box">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  autoComplete="email"
                />

                <span className="auth-input-icon">
                  ✉
                </span>
              </div>

              {/* PHONE */}
              <div className="auth-input-box">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  autoComplete="tel"
                />

                <span className="auth-input-icon">
                  📱
                </span>
              </div>

              {/* PASSWORD */}
              <div className="auth-input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="new-password"
                />

                <span className="auth-input-icon">
                  🔒
                </span>
              </div>

              <div className="auth-password-hint">
                Password must contain at least 6 characters.
              </div>

              {/* ERROR */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* SUCCESS */}
              {success && (
                <div className="auth-success">
                  {success}
                </div>
              )}

              {/* REGISTER */}
              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading
                  ? "Creating Account..."
                  : "Register"}
              </button>
            </form>

            {/* LOGIN */}
            <div className="auth-switch">
              <span>Already have an account?</span>

              <button
                type="button"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Signup;