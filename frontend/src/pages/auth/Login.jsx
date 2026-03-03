import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/form.css";
import illustration from "../../assets/login-illustration.svg";
import googleIcon from "../../assets/google_logo.png";

function Login() {
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Read message from query string
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const message = params.get("message");

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

          {/* ✅ Show message if exists */}
          {message && (
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
            <input type="email" />
          </div>

          <div className="form-group">
            <label>Password</label>

            <div className="password-field">
              <input type={showPassword ? "text" : "password"} />

              <span
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <circle
                      cx="12"
                      cy="12"
                      r="3"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M3 3l18 18"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M10.58 10.58A3 3 0 0012 15a3 3 0 002.42-4.42"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M2 12s3.5-7 10-7 10 7 10 7a18.5 18.5 0 01-3.5 4.5"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                )}
              </span>
            </div>
          </div>

          <button className="btn-primary">Sign In</button>

          <div className="divider">
            <span>or</span>
          </div>

          <button className="btn-google">
            <img src={googleIcon} alt="Google" />
            Sign in with Google
          </button>

          <p className="signup-text">
            Don’t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;