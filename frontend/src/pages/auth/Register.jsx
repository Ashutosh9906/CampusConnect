// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import GoogleButton from "../../components/auth/GoogleButton";
// import OTPInput from "../../components/auth/OTPInput";
// import "../../styles/auth.css";
// import "../../styles/form.css";

// function Register() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState(["", "", "", "", "", ""]);

//   const handleVerifyOTP = () => {
//     navigate("/complete-profile");
//   };

//   return (
//     <div className="auth-container">
//       <h2>Create your account</h2>

//       <input
//         type="email"
//         placeholder="College Email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />

//       <OTPInput otp={otp} setOtp={setOtp} />

//       <button className="primary-btn" onClick={handleVerifyOTP}>
//         Verify OTP
//       </button>

//       <div className="divider">or</div>

//       <GoogleButton />
//     </div>
//   );
// }

// export default Register;
import { useState } from "react";
import GoogleButton from "../../components/auth/GoogleButton";
import OTPInput from "../../components/auth/OTPInput";
import illustration from "../../assets/login-illustration.svg";
import "../../styles/auth.css";
import "../../styles/form.css";

function Register() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);

  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [prn, setPrn] = useState("");
  const [roll, setRoll] = useState("");
  const [division, setDivision] = useState("");

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* LEFT PANEL — SAME AS LOGIN */}
        <div className="auth-left">
          <img src={illustration} alt="Campus Connect" />
          <h2>Campus Connect</h2>
          <p>One platform to discover, register, and engage in campus events</p>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          {/* STEP 1 — EMAIL */}
          {step === 1 && (
            <>
              <h3>Create your account</h3>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="College Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <button className="btn-primary" onClick={() => setStep(2)}>
                Send OTP
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <GoogleButton />
            </>
          )}

          {/* STEP 2 — OTP */}
          {/* STEP 2 */}
          {step === 2 && (
            <>
              <h3>Email Verification</h3>

              <p className="otp-subtext">
                We’ve sent a 6-digit verification code to your registered email
                address.
              </p>

              <OTPInput otp={otp} setOtp={setOtp} />

              <button className="btn-primary" onClick={() => setStep(3)}>
                Verify
              </button>

              <p className="resend-text">
                Didn’t receive the code? <span>Resend OTP</span>
              </p>
            </>
          )}
          {/* STEP 3 — COMPLETE PROFILE */}
          {step === 3 && (
            <>
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
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
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Register;
