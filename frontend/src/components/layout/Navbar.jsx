import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/cc-logo.png";
import "../../styles/navbar.css";

function Navbar() {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("");
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

    const handleScrollSpy = () => {
      const sections = ["about", "contact"];

      for (let sec of sections) {
        const element = document.getElementById(sec);
        if (element) {
          const rect = element.getBoundingClientRect();

          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    // 🔥 NEW: listen for profile updates
    const handleUserUpdate = () => {
      loadUser();
    };

    window.addEventListener("scroll", handleScrollSpy);
    window.addEventListener("storage", loadUser);
    window.addEventListener("userUpdated", handleUserUpdate); // ✅ ADD THIS

    return () => {
      window.removeEventListener("scroll", handleScrollSpy);
      window.removeEventListener("storage", loadUser);
      window.removeEventListener("userUpdated", handleUserUpdate); // ✅ ADD THIS
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
  const handleScroll = (id) => {
    navigate(`/?scroll=${id}`);
  };
  const getInitials = (name) => {
    if (!name) return "U";

    return name
      .trim()
      .split(" ")
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  };
  return (
    <nav className="navbar-container">
      <div className="navbar-pill-full">
        {/* LOGO */}
        <div className="navbar-logo-wrap">
          <NavLink to="/">
            <img src={logo} alt="Campus Connect" />
          </NavLink>
        </div>

        {/* LINKS */}
        <div className="navbar-links">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/events">Events</NavLink>
          {/* Show Requests only for CLUB_HEAD */}
          {(user?.clubRole === 'CLUB_HEAD' || user?.role === 'CLUB_HEAD') && (
            <NavLink to="/club-requests">Requests</NavLink>
          )}
          {/* ABOUT */}
          {/* <a
            href="#about"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("about")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            About
          </a> */}
          {/* <NavLink to="/?scroll=about">About</NavLink> */}
          <span
            className={activeSection === "about" ? "active-link" : ""}
            onClick={() => handleScroll("about")}
          >
            About
          </span>

          {/* CONTACT */}
          {/* <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
          >
            Contact
          </a> */}
          {/* <NavLink to="/?scroll=contact">Contact</NavLink> */}
          <span
            className={activeSection === "contact" ? "active-link" : ""}
            onClick={() => handleScroll("contact")}
          >
            Contact
          </span>

          {/* ✅ Show Clubs only when a club role or active club exists */}
          {((user?.clubRole && user.clubRole !== "STUDENT") || (user?.role && user.role !== "Student")) && (
            <NavLink to="/clubs">Clubs</NavLink>
          )}
        </div>

        {/* AUTH */}
        <div className="navbar-action">
          {user ? (
            <div className="profile-wrapper">
              <div className="profile-btn">
                <div className="profile-avatar">
                  {getInitials(user?.name || "")}
                </div>

                <span className="profile-name">
                  {user?.name || "My Profile"}
                </span>
              </div>

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
