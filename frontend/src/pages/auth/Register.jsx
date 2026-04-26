import { useState } from "react";
import { useNavigate } from "react-router-dom";
import illustration from "../../assets/login-illustration.svg";
import OTPInput from "../../components/auth/OTPInput";

import "../../styles/auth.css";
import "../../styles/form.css";

function Register() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: Profile
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Profile data
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [prn, setPrn] = useState("");
  const [roll, setRoll] = useState("");
  const [division, setDivision] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 🔥 STEP 1 — SEND OTP
  const handleSendOTP = async () => {
    try {
      setError("");
      if (!email) {
        setError("Please enter your email");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API}/otp/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to send OTP");
        return;
      }

      setStep(2);
    } catch (err) {
      console.error(err);
      setError("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 2 — VERIFY OTP
  const handleVerifyOTP = async () => {
    try {
      setError("");
      const otpValue = otp.join("");

      if (otpValue.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API}/otp/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpValue })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid OTP");
        return;
      }

      setStep(3);
    } catch (err) {
      console.error(err);
      setError("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 3 — REGISTER USER
  const handleRegister = async () => {
    try {
      setError("");

      // Validation
      if (!name || !password || !prn || !roll || !division) {
        setError("Please fill all fields");
        return;
      }

      setLoading(true);

      const res = await fetch(`${API}/otp/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, name, prn, roll, division })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Registration failed");
        return;
      }

      // Success
      localStorage.setItem("user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("userUpdated"));
      navigate("/");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
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
          <p>One platform to discover, register, and engage in campus events</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          {/* STEP 1: EMAIL */}
          {step === 1 && (
            <>
              <h3>Create your account</h3>

              {error && (
                <div style={{ background: "#ffe5e5", color: "#b30000", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                  {error}
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

              <button className="btn-primary" onClick={handleSendOTP} disabled={loading}>
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <p style={{ marginTop: "15px", textAlign: "center", fontSize: "14px" }}>
                Already have an account? <a href="/login">Sign in</a>
              </p>
            </>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <>
              <h3>Email Verification</h3>

              {error && (
                <div style={{ background: "#ffe5e5", color: "#b30000", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <p style={{ fontSize: "14px", color: "#666", marginBottom: "15px" }}>
                Enter the 6-digit OTP sent to {email}
              </p>

              <OTPInput otp={otp} setOtp={setOtp} />

              <button className="btn-primary" onClick={handleVerifyOTP} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                className="btn-secondary"
                onClick={() => setStep(1)}
                style={{ marginTop: "10px", background: "#f0f0f0", color: "#333" }}
              >
                Back
              </button>
            </>
          )}

          {/* STEP 3: COMPLETE PROFILE */}
          {step === 3 && (
            <>
              <h3>Complete your profile</h3>

              {error && (
                <div style={{ background: "#ffe5e5", color: "#b30000", padding: "10px", borderRadius: "6px", marginBottom: "15px", fontSize: "14px" }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? "🙈" : "👁️"}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>PRN</label>
                <input
                  type="text"
                  placeholder="e.g., A0123456"
                  value={prn}
                  onChange={(e) => setPrn(e.target.value.toUpperCase())}
                  maxLength="8"
                />
              </div>

              <div className="form-group">
                <label>Roll Number</label>
                <input
                  type="text"
                  placeholder="e.g., 12345"
                  value={roll}
                  onChange={(e) => setRoll(e.target.value)}
                  maxLength="5"
                />
              </div>

              <div className="form-group">
                <label>Division</label>
                <input
                  type="text"
                  placeholder="e.g., A, B, C"
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={handleRegister} disabled={loading}>
                {loading ? "Registering..." : "Complete Registration"}
              </button>

              <button
                className="btn-secondary"
                onClick={() => setStep(2)}
                style={{ marginTop: "10px", background: "#f0f0f0", color: "#333" }}
              >
                Back
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;