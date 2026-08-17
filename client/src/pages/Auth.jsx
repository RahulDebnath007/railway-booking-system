import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Auth() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialSignup = location.pathname === "/signup";

  const [isSignup, setIsSignup] = useState(initialSignup);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const switchToLogin = () => {
    setError("");
    setIsSignup(false);
    navigate("/login", { replace: true });
  };

  const switchToSignup = () => {
    setError("");
    setIsSignup(true);
    navigate("/signup", { replace: true });
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSignupChange = (e) => {
    const { name, value } = e.target;

    setSignupData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    if (!loginData.email.trim() || !loginData.password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", loginData);

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
        error.response?.data?.message ||
          "Unable to login."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    const name = signupData.name.trim();
    const email = signupData.email.trim();
    const phone = signupData.phone.trim();
    const password = signupData.password;

    if (!name || !email || !phone || !password) {
      setError("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signup", {
        name,
        email,
        phone,
        password,
      });

      setLoginData({
        email,
        password: "",
      });

      setSignupData({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

      setError("");

      alert(
        response.data.message ||
          "Account created successfully. Please login."
      );

      switchToLogin();
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
    <div className={`auth-page ${isSignup ? "signup-mode" : "login-mode"}`}>
      <div className="auth-container">

        {/* BLUE WELCOME PANEL */}
        <div className="auth-welcome">

          <div className="auth-welcome-content">

            <div className="auth-train-icon">
              🚆
            </div>

            {!isSignup ? (
              <>
                <h1>
                  Hello,
                  <br />
                  Welcome!
                </h1>

                <p>
                  Don't have an account?
                </p>

                <button
                  type="button"
                  className="auth-outline-button"
                  onClick={switchToSignup}
                >
                  Register
                </button>
              </>
            ) : (
              <>
                <h1>
                  Welcome!
                </h1>

                <p>
                  Already have an account?
                </p>

                <button
                  type="button"
                  className="auth-outline-button"
                  onClick={switchToLogin}
                >
                  Login
                </button>
              </>
            )}

          </div>
        </div>

        {/* LOGIN FORM */}
        <div className={`auth-form-section ${!isSignup ? "active" : ""}`}>
          <div className="auth-form-wrapper">

            <h2>Login</h2>

            <p className="auth-form-subtitle">
              Login to your RailBook account
            </p>

            <form onSubmit={handleLogin}>

              <div className="auth-input">
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  autoComplete="email"
                />

                <span>✉️</span>
              </div>

              <div className="auth-input">
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  autoComplete="current-password"
                />

                <span>🔒</span>
              </div>

              <div className="forgot-password">
                Forgot Password?
              </div>

              {error && !isSignup && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-primary-button"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>

            </form>

            <p className="auth-bottom-text">
              Don't have an account?

              <button
                type="button"
                onClick={switchToSignup}
              >
                Register
              </button>
            </p>

          </div>
        </div>

        {/* SIGNUP FORM */}
        <div className={`auth-form-section signup-form ${isSignup ? "active" : ""}`}>
          <div className="auth-form-wrapper">

            <h2>Register</h2>

            <p className="auth-form-subtitle">
              Create your RailBook account
            </p>

            <form onSubmit={handleSignup}>

              <div className="auth-input">
                <input
                  type="text"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  placeholder="Full Name"
                  autoComplete="name"
                />

                <span>👤</span>
              </div>

              <div className="auth-input">
                <input
                  type="email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  placeholder="Email"
                  autoComplete="email"
                />

                <span>✉️</span>
              </div>

              <div className="auth-input">
                <input
                  type="tel"
                  name="phone"
                  value={signupData.phone}
                  onChange={handleSignupChange}
                  placeholder="Phone Number"
                  autoComplete="tel"
                />

                <span>📱</span>
              </div>

              <div className="auth-input">
                <input
                  type="password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  placeholder="Password"
                  autoComplete="new-password"
                />

                <span>🔒</span>
              </div>

              <p className="password-hint">
                Password must contain at least 6 characters.
              </p>

              {error && isSignup && (
                <div className="auth-error">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="auth-primary-button"
                disabled={loading}
              >
                {loading ? "Creating Account..." : "Register"}
              </button>

            </form>

            <p className="auth-bottom-text">
              Already have an account?

              <button
                type="button"
                onClick={switchToLogin}
              >
                Login
              </button>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}

export default Auth;