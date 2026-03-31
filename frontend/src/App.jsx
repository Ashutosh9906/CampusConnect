import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/landing/Landing";
import CompleteProfile from "./pages/auth/CompleteProfile";
import Clubs from "./pages/clubs/Clubs";

import GoogleSuccessLogin from "./pages/auth/GoogleSuccessLogin";
import GoogleSuccessRegister from "./pages/auth/GoogleSuccessRegister";
import VerifyOTP from "./pages/auth/VerifyOTP";

import ListEvent from "./pages/events/ListEvent";
import EventDetails from "./components/events/EventDetails.jsx";

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
    <Routes>
      {/* HOME */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Landing />
          </>
        }
      />

      {/* CLUBS */}
      <Route
        path="/clubs"
        element={
          <>
            <Navbar />
            <Clubs />
          </>
        }
      />

      {/* EVENTS */}
      <Route path="/event/:id" element={<EventDetails />} />

      <Route
        path="/create-event"
        element={
          <>
            <Navbar />
            <ListEvent />
          </>
        }
      />

      {/* AUTH (NO NAVBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />
      <Route path="/verify-otp" element={<VerifyOTP />} />

      {/* GOOGLE */}
      <Route path="/auth/success-login" element={<GoogleSuccessLogin />} />
      <Route
        path="/auth/success-register"
        element={<GoogleSuccessRegister />}
      />
      <Route path="/auth/failure" element={<GoogleFailure />} />
    </Routes>
  );
}
export default App;
