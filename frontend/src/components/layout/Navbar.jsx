import { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import logo from "../../assets/cc-logo.png";
import "../../styles/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Load user
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    window.addEventListener("storage", loadUser);

    return () => {
      window.removeEventListener("storage", loadUser);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.log("No active session");
    }

    localStorage.removeItem("user");

    loadUser();
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
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/events">Events</NavLink>

          {/* ABOUT */}
          <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            About
          </a>

          {/* CONTACT */}
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Contact
          </a>

          {/* ✅ ONLY AFTER LOGIN */}
          {user && <NavLink to="/clubs">Clubs</NavLink>}
        </div>

        {/* AUTH */}
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
