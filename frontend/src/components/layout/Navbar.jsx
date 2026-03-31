import { Link, NavLink } from "react-router-dom";
import "../../styles/navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LEFT - BRAND */}
        <div className="navbar-brand">
          <Link to="/">Campus Connect</Link>
        </div>

        {/* CENTER - LINKS */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" className="nav-link">
              Home
            </NavLink>
          </li>

          <li>
            <NavLink to="/events" className="nav-link">
              Events
            </NavLink>
          </li>

          <li>
            <a
              href="#about"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("about").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              About
            </a>
          </li>
          {localStorage.getItem("role") === "organizer" && (
            <a href="/create-event" className="nav-link">
              Add Event
            </a>
          )}
          <li>
            <a
              href="#contact"
              className="nav-link"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("contact").scrollIntoView({
                  behavior: "smooth",
                });
              }}
            >
              Contact
            </a>
          </li>
        </ul>

        {/* RIGHT - LOGIN BUTTON */}
        <div className="navbar-auth">
          <a href="http://localhost:5173/login" className="login-btn">
            Sign In
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
