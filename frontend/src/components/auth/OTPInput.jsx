// import { useRef } from "react";
// import "../../styles/otp.css";

// function OTPInput({ otp, setOtp }) {
//   const inputs = useRef([]);

//   const handleChange = (e, index) => {
//     const value = e.target.value.replace(/\D/, "");
//     if (!value) return;

//     const newOtp = [...otp];
//     newOtp[index] = value;
//     setOtp(newOtp);

//     if (index < otp.length - 1) {
//       inputs.current[index + 1].focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace") {
//       const newOtp = [...otp];

//       if (otp[index]) {
//         // Clear current box
//         newOtp[index] = "";
//         setOtp(newOtp);
//       } else if (index > 0) {
//         // Move back & clear
//         inputs.current[index - 1].focus();
//         newOtp[index - 1] = "";
//         setOtp(newOtp);
//       }
//     }
//   };

//   return (
//     <div className="otp-container">
//       {otp.map((digit, i) => (
//         <input
//           key={i}
//           ref={(el) => (inputs.current[i] = el)}
//           type="text"
//           inputMode="numeric"
//           maxLength="1"
//           value={digit}
//           onChange={(e) => handleChange(e, i)}
//           onKeyDown={(e) => handleKeyDown(e, i)}
//         />
//       ))}
//     </div>
//   );
// }

// export default OTPInput;
import { useRef } from "react";
import "../../styles/otp.css";

function OTPInput({ otp, setOtp }) {
  const inputs = useRef([]);

  const handleChange = (e, index) => {
    const value = e.target.value.replace(/\D/, "");
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (index < otp.length - 1) {
      inputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = "";
      } else if (index > 0) {
        inputs.current[index - 1].focus();
        newOtp[index - 1] = "";
      }

      setOtp(newOtp);
    }
  };

  return (
    <div className="otp-container">
      {otp.map((digit, i) => (
        <input
          key={i}
          ref={(el) => (inputs.current[i] = el)}
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
        />
      ))}
    </div>
  );
}

export default OTPInput;
