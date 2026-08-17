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

      localStorage.setItem("token", token);
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      if (response.data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.message || "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        {/* LEFT PANEL */}
        <div className="auth-welcome-panel">
          <div className="auth-welcome-content">
            <div className="auth-logo">🚆</div>

            <h1>Hello, Welcome!</h1>

            <p>Don't have an account?</p>

            <button
              type="button"
              className="auth-outline-button"
              onClick={() => navigate("/signup")}
            >
              Register
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-form-panel">
          <div className="auth-form-content">
            <h2>Login</h2>

            <p className="auth-form-subtitle">
              Login to your RailBook account
            </p>

            <form onSubmit={handleSubmit}>
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

                <span className="auth-input-icon">✉</span>
              </div>

              {/* PASSWORD */}
              <div className="auth-input-box">
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  autoComplete="current-password"
                />

                <span className="auth-input-icon">🔒</span>
              </div>

              {/* ERROR */}
              {error && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              {/* FORGOT PASSWORD */}
              <div className="auth-forgot">
                <button
                  type="button"
                  onClick={() => {
                    setError(
                      "Password recovery is not available yet."
                    );
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              {/* LOGIN */}
              <button
                type="submit"
                className="auth-submit-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* MOBILE / SECONDARY SIGNUP */}
            <div className="auth-switch">
              <span>Don't have an account?</span>

              <button
                type="button"
                onClick={() => navigate("/signup")}
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;