import { useRef } from "react";
import "../../styles/otp.css";

function VerifyOTP() {
  const inputsRef = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d?$/.test(value)) return;

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="otp-page">
      <div className="otp-card otp-animate">

        <h3>Email Verification</h3>
        <p className="otp-subtext">
          We’ve sent a 6-digit verification code to your registered email address.
        </p>

        <div className="otp-inputs">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              maxLength="1"
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>

        <button className="btn-primary otp-btn">VERIFY</button>

        <p className="resend-text">
          Didn’t receive the code? <span>Resend OTP</span>
        </p>

      </div>
    </div>
  );
}

export default VerifyOTP;
