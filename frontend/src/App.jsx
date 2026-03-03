import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Landing from "./pages/landing/Landing";
import CompleteProfile from "./pages/auth/CompleteProfile";
import GoogleSuccess from "./pages/auth/GoogleSuccess";
import VerifyOTP from "./pages/auth/VerifyOTP";

import "./styles/App.css";

function GoogleFailure() {
  const params = new URLSearchParams(window.location.search);
  const message = params.get("message");

  return (
    <div style={{ padding: "40px", fontSize: "18px" }}>
      <h2>Google login failed</h2>
      <p>{message}</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/complete-profile" element={<CompleteProfile />} />
        <Route path="/" element={<Landing />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />

        {/* Google OAuth routes */}
        <Route path="/auth/success" element={<GoogleSuccess />} />
        <Route path="/auth/failure" element={<GoogleFailure />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
