import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { account } from "../../config/appwrite.js";
import { ID } from "appwrite";

import GoogleButton from "../../components/auth/GoogleButton";
import OTPInput from "../../components/auth/OTPInput";
import illustration from "../../assets/login-illustration.svg";

import "../../styles/auth.css";
import "../../styles/form.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);

  // 🔥 STEP 1 — SEND OTP
  const handleSendOTP = async () => {
    try {
      if (!email) return alert("Enter your email");

      setLoading(true);

      const response = await account.createEmailToken(ID.unique(), email);

      // ✅ store correct userId
      localStorage.setItem("otpUserId", response.userId);

      setStep(2);
    } catch (err) {
      console.log(err);
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // 🔥 STEP 2 — VERIFY OTP
  const handleVerifyOTP = async () => {
    try {
      const otpValue = otp.join("");
      const userId = localStorage.getItem("otpUserId");

      if (!userId) {
        alert("Session expired. Please resend OTP.");
        setStep(1);
        return;
      }

      if (otpValue.length !== 6) {
        alert("Enter full 6-digit OTP");
        return;
      }

      setLoading(true);

      // ✅ verify OTP
      await account.createSession(userId, otpValue);

      const user = await account.get();
      console.log(user);

      // ✅ 🔥 IMPORTANT: call REGISTER route
      const res = await fetch("http://localhost:4000/auth/google-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          appwriteUserId: user.$id,
          email: user.email
        })
      });

      const data = await res.json();

      // ❌ If already exists → redirect to login
      if (res.status === 200 && !data.isNewUser) {
        await account.deleteSession("current"); // 🔥 logout from Appwrite

        navigate("/login?message=Account already exists. Please login.");
        return;
      }

      if (!res.ok || !data.success) {
        alert(data.message || "Registration failed");
        return;
      }

      // ✅ clear temp data
      localStorage.removeItem("otpUserId");

      // ✅ redirect
      navigate("/complete-profile");

    } catch (err) {
      console.log(err);

      if (err.code === 401) {
        alert("Invalid or expired OTP. Please try again.");
      } else {
        alert("Something went wrong");
      }
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

          {/* STEP 1 */}
          {step === 1 && (
            <>
              <h3>Create your account</h3>

              <input
                type="email"
                placeholder="College Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <button
                className="btn-primary"
                onClick={handleSendOTP}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send OTP"}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <GoogleButton mode="register" />
            </>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h3>Email Verification</h3>

              <p className="otp-subtext">
                Enter the 6-digit OTP sent to your email.
              </p>

              <OTPInput otp={otp} setOtp={setOtp} />

              <button
                className="btn-primary"
                onClick={handleVerifyOTP}
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify"}
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default Register;