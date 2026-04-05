import { useState } from "react";
import "../../styles/auth.css";
import "../../styles/form.css";
import { account } from "../../config/appwrite";

function CompleteProfile() {
  const [showPassword, setShowPassword] = useState(false);

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
      const user = await account.get();

      const res = await fetch("http://localhost:4000/auth/complete-profile", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appwriteUserId: user.$id,
          name,
          password,
          prn,
          roll,
          division,
        }),
      });

      const result = await res.json();

      if (res.status === 400 || res.status === 404) {
        window.location.href = `/login?message=${result.message}`;
        return;
      }

      if (res.status === 500 && !result.success) {
        window.location.href = `/auth/failure?message=${encodeURIComponent(
          result.message || "Registration failed"
        )}`;
        return;
      }

      try {
        await account.deleteSession("current");
      } catch (err) {
        console.log("Session cleanup failed (safe to ignore)");
      }

      // Success
      localStorage.setItem("user", JSON.stringify(result.user));
      window.location.href = "/";
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

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

          {/* NAME */}
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* PRN */}
          <input
            type="text"
            placeholder="PRN Number"
            value={prn}
            onChange={(e) => setPrn(e.target.value)}
          />

          {/* ROLL */}
          <input
            type="text"
            placeholder="Roll Number"
            value={roll}
            onChange={(e) => setRoll(e.target.value)}
          />

          {/* DIVISION */}
          <input
            type="text"
            placeholder="Division"
            value={division}
            onChange={(e) => setDivision(e.target.value)}
          />

          {/* BUTTON */}
          <button
            className="btn-primary"
            onClick={handleSubmit}
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default CompleteProfile;