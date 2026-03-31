import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../../assets/cc-logo.png";
import "../../styles/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("No active session or already logged out");
    }

    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-pill-full">
        {/* LOGO */}
        <div className="navbar-logo-wrap">
          <img src={logo} alt="Campus Connect" />
        </div>

        {/* LINKS */}
        <div className="navbar-links">
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>

          {/* YOUR ADD EVENT FEATURE (kept) */}
          {localStorage.getItem("role") === "organizer" && (
            <NavLink to="/create-event">Add Event</NavLink>
          )}
        </div>

        {/* AUTH SECTION */}
        <div className="navbar-action">
          {user ? (
            <div className="profile-wrapper">
              <span className="profile-btn">{user.name || "My Profile"}</span>

              <div className="profile-dropdown">
                <NavLink to="/profile">View Profile</NavLink>
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            </div>
          ) : (
            <NavLink to="/login" className="login-btn">
              Login
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
