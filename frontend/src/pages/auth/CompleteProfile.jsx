import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/auth.css";
import "../../styles/form.css";

function CompleteProfile() {
  const API = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [roll, setRoll] = useState("");
  const [division, setDivision] = useState("");

  const handleSubmit = async () => {
    // Basic validation
    if (!name || !password || !prn || !roll || !division) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${API}/auth/complete-profile`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
          prn,
          roll,
          division,
        }),
      });

      const result = await res.json();

      if (res.status === 400 || res.status === 404) {
        navigate(`/login?message=${result.message}`);
        return;
      }

      if (res.status === 500 && !result.success) {
        navigate(
          `/auth/failure?message=${encodeURIComponent(
            result.message || "Registration failed"
          )}`
        );
        return;
      }

      // Success
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-right">
          <h3>Complete your profile</h3>

          {/* PASSWORD */}
          <div className="form-group">
            <label>Password</label>
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
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          {/* NAME */}
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* PRN */}
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

          {/* ROLL */}
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

          {/* DIVISION */}
          <div className="form-group">
            <label>Division</label>
            <input
              type="text"
              placeholder="e.g., A, B, C"
              value={division}
              onChange={(e) => setDivision(e.target.value)}
            />
          </div>

          <button className="btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? "Completing..." : "Complete Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;
