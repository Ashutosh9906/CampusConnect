import { useState } from "react";
import StudentDetailsForm from "./StudentDetailsForm";

function OTPForm() {
  const [verified, setVerified] = useState(false);

  if (verified) {
    return <StudentDetailsForm />;
  }

  return (
    <div className="auth-container">
      <h2>Verify OTP</h2>

      <input type="text" placeholder="Enter OTP" />

      <button onClick={() => setVerified(true)}>
        Verify OTP
      </button>
    </div>
  );
}

export default OTPForm;
