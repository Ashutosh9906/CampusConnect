import { useState } from "react";
import "../../styles/auth.css";
import "../../styles/form.css";

function CompleteProfile() {
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [roll, setRoll] = useState("");
  const [division, setDivision] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-right">
          <h3>Complete your profile</h3>

          {/* PASSWORD */}
          <div className="form-group">
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <span
                className="eye-btn"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  /* OPEN EYE — visible */
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
                  /* SLASHED EYE — hidden */
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

          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="PRN Number"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
          />

          <input
            type="text"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          <input
            type="text"
            placeholder="Division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          />

          <button className="btn-primary">Create Account</button>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
