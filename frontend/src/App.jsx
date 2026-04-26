import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import RoleModal from "./components/common/RoleModal";
import EventDetails from "./components/events/EventDetails.jsx";
import Footer from "./components/Footer";
import Navbar from "./components/layout/Navbar";
import CompleteProfile from "./pages/auth/CompleteProfile";
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

function App() {
  const API = import.meta.env.VITE_API_URL;

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("user");
    return stored && stored !== "undefined" ? JSON.parse(stored) : null;
  });

  const [showRoleModal, setShowRoleModal] = useState(false);

  const loadUser = async () => {
    const stored = localStorage.getItem("user");
    const localUser = stored && stored !== "undefined" ? JSON.parse(stored) : null;
    setUser(localUser);

    if (!localUser) {
      return;
    }

    try {
      const res = await fetch(`${API}/auth/me`, {
        credentials: "include",
      });
      const data = await res.json();

      if (data?.success && data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
        setUser(data.user);
      } else if (!data?.success && res.status === 401) {
        // Token expired or invalid - logout user
        handleAutoLogout();
      }
    } catch (err) {
      console.error("Failed to sync current user", err);
    }
  };

  const handleAutoLogout = async () => {
    try {
      await fetch(`${API}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error:", err);
    }
    
    // Clear user data
    localStorage.removeItem("user");
    setUser(null);
    
    // Redirect to login
    window.location.href = "/login?session=expired";
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

    loadUser();

    // Check token validity every 5 minutes
    const tokenCheckInterval = setInterval(() => {
      if (user) {
        loadUser();
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => {
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", loadUser);
      clearInterval(tokenCheckInterval);
    };
  }, [user]);

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
          </Routes>
        </div>

        {/* MODIFIED — Footer now inside app-wrapper so flex layout controls it */}
        <Footer />
      </div>
    </>
  );
}

export default App;
