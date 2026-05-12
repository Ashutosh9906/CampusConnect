import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import illustration from "../../assets/login-illustration.svg";
import "../../styles/auth.css";
import "../../styles/form.css";

function Login() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = params.get("message");
  const sessionExpired = params.get("session") === "expired";

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        alert("Please fill in all fields");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const result = await res.json();

      if (res.status === 404 || res.status === 400) {
        navigate(`/login?message=${result.message}`);
        return;
      }

      if (res.status === 500 && !result.success) {
        navigate(
          `/login?message=${encodeURIComponent(
            result.message || "Login failed"
          )}`
        );
        return;
      }

      localStorage.setItem("user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT PANEL */}
        <div className="auth-left">
          <img src={illustration} alt="Campus Connect" />
          <h2>Campus Connect</h2>
          <p>One platform for campus events</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <h3>Sign In</h3>

          {/* Session Expired Message */}
          {sessionExpired && (
            <div
              style={{
                background: "#fff3cd",
                color: "#856404",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              ⏰ Your session has expired. Please login again.
            </div>
          )}

          {/* Show message if exists */}
          {message && !sessionExpired && (
            <div
              style={{
                background: "#ffe5e5",
                color: "#b30000",
                padding: "10px",
                borderRadius: "6px",
                marginBottom: "15px",
                fontSize: "14px",
              }}
            >
              {message}
            </div>
          )}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="your.email@college.ac.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="signup-text">
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
