import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

      const token = response.data.token;

      if (!token) {
        setError("Login succeeded but no token was received.");
        return;
      }

      // Store JWT
      localStorage.setItem("token", token);

      // Store logged-in user
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(error.response?.data?.message || "Unable to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">RailBook</div>

        <div className="navbar-actions">
          <button onClick={() => navigate("/signup")}>Sign Up</button>
        </div>
      </nav>

      {/* Login Page */}
      <main className="page-container">
        <div
          style={{
            maxWidth: "500px",
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
            <h1>Welcome Back</h1>

            <p>Login to your RailBook account to continue.</p>
          </div>

          {/* Login Card */}
          <div className="card">
            <form onSubmit={handleSubmit}>
              {/* Email */}
              <div className="form-group">
                <label>Email Address</label>

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
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
                <label>Password</label>

                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
              </div>

              {/* Error */}
              {error && (
                <div
                  className="error-message"
                  style={{
                    marginTop: "20px",
                  }}
                >
                  {error}
                </div>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="primary-button"
                disabled={loading}
                style={{
                  width: "100%",
                  marginTop: "24px",
                }}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Signup */}
            <div
              style={{
                textAlign: "center",
                marginTop: "24px",
              }}
            >
              <p>Don't have an account?</p>

              <button
                type="button"
                onClick={() => navigate("/signup")}
                style={{
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "#2563eb",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                Create an account
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Login;
