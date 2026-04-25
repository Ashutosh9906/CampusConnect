import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import RoleModal from "./components/common/RoleModal";
import EventDetails from "./components/events/EventDetails.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/layout/Navbar";
import CompleteProfile from "./pages/auth/CompleteProfile";
import GoogleSuccessLogin from "./pages/auth/GoogleSuccessLogin";
import GoogleSuccessRegister from "./pages/auth/GoogleSuccessRegister";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ClubRequestsPage from "./pages/clubs/ClubRequestsPage";
import Clubs from "./pages/clubs/Clubs";
import EventsPage from "./pages/events/EventsPage";
import ListEvent from "./pages/events/ListEvent";
import Landing from "./pages/landing/Landing";
import Profile from "./pages/profile/Profile.jsx";

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
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const [showRoleModal, setShowRoleModal] = useState(false);

  const loadUser = () => {
    const stored = localStorage.getItem("user");
    setUser(stored ? JSON.parse(stored) : null);
  };

  useEffect(() => {
    if (user && !user.role) {
      setShowRoleModal(true);
    }
  }, [user]);

  useEffect(() => {
    // Listen for user updates
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
    };
  }, []);

  const handleRoleSelected = (role) => {
    const updatedUser = { ...user, role };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
    setShowRoleModal(false);
  };

  return (
    <>
      {showRoleModal && <RoleModal onRoleSelected={handleRoleSelected} />}

      {/* MODIFIED — app-wrapper now exists in DOM so CSS flex layout works */}
      <div className="app-wrapper">
        {/* MODIFIED — content div now exists in DOM so flex: 1 works */}
        <div className="content">
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

            {/* PROFILE */}
            <Route
              path="/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                </>
              }
            />

            {/* CLUB REQUESTS */}
            <Route
              path="/club-requests"
              element={
                <>
                  <Navbar />
                  <ClubRequestsPage />
                </>
              }
            />

            {/* EVENTS */}
            <Route path="/event/:id" element={<EventDetails />} />

            <Route
              path="/events"
              element={
                <>
                  <Navbar />
                  <EventsPage />
                </>
              }
            />

            <Route
              path="/create-event"
              element={
                <>
                  <Navbar />
                  <ListEvent />
                </>
              }
            />

            {/* AUTH — NO NAVBAR */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/complete-profile" element={<CompleteProfile />} />
            <Route path="/verify-otp" element={<VerifyOTP />} />

            {/* GOOGLE */}
            <Route
              path="/auth/success-login"
              element={<GoogleSuccessLogin />}
            />
            <Route
              path="/auth/success-register"
              element={<GoogleSuccessRegister />}
            />
            <Route path="/auth/failure" element={<GoogleFailure />} />
          </Routes>
        </div>

        {/* MODIFIED — Footer now inside app-wrapper so flex layout controls it */}
        <Footer />
      </div>
    </>
  );
}

export default App;
