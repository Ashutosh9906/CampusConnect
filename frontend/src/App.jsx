import { Routes, Route } from "react-router-dom";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Navbar from "./components/layout/Navbar";
import Landing from "./pages/landing/Landing";
import CompleteProfile from "./pages/auth/CompleteProfile";
import GoogleSuccess from "./pages/auth/GoogleSuccess";
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
      {/* HOME / LANDING */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Landing />
          </>
        }
      />

      {/* AUTH PAGES (NO NAVBAR) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/complete-profile" element={<CompleteProfile />} />

      {/* GOOGLE AUTH */}
      <Route path="/auth/success" element={<GoogleSuccess />} />
      <Route path="/auth/failure" element={<GoogleFailure />} />
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
    </Routes>
  );
}

export default App;
